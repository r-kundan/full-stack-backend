class ApiResponce{
    constructor (
        statusCode,
        message = "succes",
        data
    ){
    this.statusCode= statusCode
    this.data=data
    this.message=message
    this.success = statusCode < 400
    this.errors =errors
    
    }}
    
    export {ApiResponce}