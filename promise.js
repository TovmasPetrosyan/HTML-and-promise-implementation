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

    then(onFulfilled, onRejected) {
      switch (this.state) {
        case 'fulfilled':
          onFulfilled(this.value);
          break;
        case 'rejected':
          onRejected(this.reason);
          break;
        default:
          this.onFulfilled.push(onFulfilled);
          this.onRejected.push(onRejected);
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


fakePromise.all = function(promisesArray){
  return new fakePromise((resolve,reject) => {
    let results = [];
    let completed = 0;
    promisesArray.forEach((value, index) => {
       fakePromise.resolve(value).then(result =>{
        results[index] = result;
        completed++;
        if(completed === promisesArray.length){
          resolve(results);
        }
       }).catch(error => reject(error))
    })
  })
}


fakePromise.allSettled = function(promisesArray){
const promises = promisesArray.map(promise => {
  return promise.then(data => {
    return {
      value: data,
      status: 'fulfilled'
    }
  }).catch(error => {
    return {
      reason: error,
      status: 'rejected'
    }
  })
})
return fakePromise.all(promises);
};

