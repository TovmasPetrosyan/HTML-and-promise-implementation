class fakePromise {
    constructor(executionFunction) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilled = [];
        this.onRejected = [];

        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onFulfilled.forEach(callback => callback(this.value));
            }
        };
        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.onRejected.forEach(callback => callback(this.reason));
            }
        };
        try {
            executionFunction(resolve, reject)
        } catch (error) {
                reject(error);
        }

    }

    then(Fulfilled,Rejected){
        switch (this.state){
            case 'fulfilled':
            onFulfilled(this.value);
            break;
            case 'rejected':
            onRejected(this.reason);
            break;
            default:
                this.onFulfilled.push(Fulfilled);
                this.onRejected.push(Rejected);
        }
        return this;
    }
    catch(onRejected) {
        if (this.state === 'rejected') {
          onRejected(this.reason);
        } else {
          this.onRejected.push(onRejected);
        }
    
        return this; 
      }

}


fakePromise.all = function(promises){
  return new fakePromise((resolve,reject) => {
    let results = [];
    let completed = 0;
    promises.forEach((value, index) => {
       fakePromise.resolve(value).then(result =>{
        results[index] = result;
        completed++;
        if(completed === promises.length){
          resolve(results);
        }
       }).catch(error => reject(error))
    })
  })
}


