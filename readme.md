
# Documentation
---
## USERS
---
### /api/signup (POST)
```
    - Expects
        - name
        - email
        - password
        - mob_no
    - Results - 200
        - success : true
    - Error - 400
        - success : false

```
### /api/login (POST)
```
        -Expects
            -email
            -password
        -Result
            -Response header gets a x-auth-token
            -success: 'Logged In'
            -error(only if error exits)
    
```
### /api/profile (GET and POST)
```
    **GET**
    - Returns user profile
    - OPT verification is a ncessity here
    - A boolean value is retuned for email and opt verification status

    **POST** (Not necessary for user to fill, but it is needed if they ever feel like filling this form)
    - Expects
        -gender
        -dob
        -addressLine1
        -addressLine2
        -city
        -state
        -pincode

```

### /api/view (GET)
```
    - Will return all hotels
    - add lazy loading
    - later on we can add something like db will omly return some data at one request
```

### /api/view/:id (GET)

```
    -return an individual hotel and all it's food items

```


# IGONORE BELOW THIS


### /api/order/ (POST)
```
    - Expects
        - rest_id -> 5dd00114d2a6fd51b892de4e
        - orderedItems - an array of food ids -> ["5dd03218fc0849055c0fd4a9","5dd0323b9eb21425440b2e33","5dd0339718367334c4114d04","5dd033a618367334c4114d05"]
        -qr
        -lat
        -lng
```

### /api/order/:id (GET)
```
    - will get all order
```


---

# LEFT TASKS FOR ME
---
### 1. OTP Vierify
```
    - Buy messaging gateway
```
### 2. Eamil Verify
```
    - Buy Sendgrid
```
### 3. Payment Gateway Integration
```
    1. Gpay
    2. paytm
    3. CCavenue
    4. UPI
```
### 4. QR Code
### 5. All Middlewares
### Test cases


```
    1. User scans qr code which is then verfied. 
       If true ask for user location. 
       If near rest place order
    2. rest gets order, now appect or reject the order
       if accepted then set timer
       else send rejected reason.
    3. if food delevered. Rest gets to tell the app
    4. now user has following option 1. order more 2. call waiter 3. Pay Bill

```