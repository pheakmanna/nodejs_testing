module.exports = function(Person) {
  Person.remoteMethod('findPeopleTop5',
    { isStatic: true,
      produces: [ 'application/json', 'application/xml', 'text/xml', 'text/html' ],
      accepts:
        [ { arg: 'id',
          type: 'number',
          description: 'ID of pet to fetch',
          required: false,
          http: { source: 'path' } } ],
      returns:
        [ { description: 'pet response',
          type: 'person',
          arg: 'data',
          root: true },
          { description: 'unexpected error',
            type: 'ErrorModel',
            arg: 'data',
            root: true } ],
      http: { verb: 'get', path: '/top5' },
      description: 'Returns Top 5 pet, if the user does not have access to the pet' }
  );
};
