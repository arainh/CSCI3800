For this assignment I used Postman to test my proxy. 

**To create an entity**

Use POST

I pass in the url 127.0.0.1:3000/create?name=`<movie name>`&debut=`<year>`&actors=`<actor1>`, `<actor2>`, `<actor3>`

Example to add the entity with:
>>  name: Bridesmaids

>>  debut: 2011

>>  actors: Kristen Wig, Mya Rudolf, Melissa McCarthy
  
  I make a POST request in Postman with the url:

>127.0.0.1:3000/create?name=Bridesmaids&debut=2011&actors=Kristen Wig, Mya Rudolf, Melissa McCarthy


**To retrieve an entity or a list of entities**

Use GET

I use queries to access an entity or a list of entities depending on the search criteria.

>127.0.0.1:3000/movies?ql=select * <enter specific query>

For instance to retrieve a single entity movie, Mean Girls

I make a GET request in Postman with the url:

>127.0.0.1:3000/movies?ql=select * where name = 'Mean Girls'

There are other queries and I use the syntax that is acceptable by Apigee.

* select * (select all, the entire collection)
* select * where name=`<movie name>` (selects the entities that match specific criteria)
* select * where actors contains `<actor name>` (grabs a list of movies with that criteria)
* select * where debut=`<year>` (lists all movies that debuted in that year)
* select * where actors contains `<actor name>` and debut=`<year>` (lists all movies with matching debut
and actor name)

**To delete an entity or a list of entities**

Use DELETE

I make a DELETE request in Postman with a query for a specific movie name such as:

>127.0.0.1:3000/delete?name=`<movie name>`

Example: 27.0.0.1:3000/delete?name=Mean Girls

This will retrieve that enitity, and then delete it.


