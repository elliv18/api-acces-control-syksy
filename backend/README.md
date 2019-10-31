### Backend



## Creating Api key:

```
mutation {
    createNewApiKey(input: {
              access: [
                {
                  id: "1", name: "api 1", urls: 
                  [
                    {
                    url: "/todos(/.*)?", methods: ["GET", "PUT", "DELETE"]
                    },
                    {
                    url: "/users(/.*)?", methods: ["GET", "POST"]
                  	}
                  ]
                }, 
                {
                  id: "2", name: "api 2", urls: 
                  {
                    url: "url 2", methods: ["GET", "PUT"]
                  }
                }
              ]
    }) {
        key,
        keyHash
    }
}

```