### Cases should be considered

key: it is a list of ids represent each page that user is allowed to access.



- User has token

  - User has key
    - token has expired <span style="color: red">redirect to /login</span>
    - token is valid 
      - User doesn't have the permission (<span style="color: red">403</span>)
      - User have the permission (<span style="color: green">OK</span>)
  - User doesn't have key ( this occurs when user close the browser and revisit the website)
    - <span style="color: green">send a request to retrive user's groups</span>
      - if token has expired <span style="color: red">redirect to /login</span>
      - else <span style="color: green">generate key</span>
        - User entered URL, but he doesn't have the permission (<span style="color: red">403</span>)
        - User have the permission (<span style="color: green">OK</span>)

- User doesn't have token <span style="color: red">redirect to /login</span>

- User entered non-exist suffix <span style="color: red">404</span>

  
