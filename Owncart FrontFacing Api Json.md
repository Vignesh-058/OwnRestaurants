{  
  "info": {  
    "\_postman\_id": "4d99f178-35cf-44d2-8414-553d3fb18e3a",  
    "name": "OWNCART",  
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",  
    "\_exporter\_id": "47711597",  
    "\_collection\_link": "https://go.postman.co/collection/47711597-4d99f178-35cf-44d2-8414-553d3fb18e3a?source=collection\_link"  
  },  
  "item": \[  
    {  
      "name": "Organization",  
      "item": \[  
        {  
          "name": "Get Organization",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Content-Type",  
                "value": "application/json",  
                "type": "text"  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\n    \\"domain\\": \\"ieyal\\"\\n}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/organization/get-org",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "organization",  
                "get-org"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Outlet Get All",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "Bearer {{json\_web\_token\_0so8}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\n    \\"belongsTo\\": \\"685670e4486951278738864e\\",\\n    \\"locationSorting\\": true,\\n    \\"lat\\": 10.777460082400633,\\n    \\"lng\\": 79.63451395714621\\n}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/organization/outlets/get-all",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "organization",  
                "outlets",  
                "get-all"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Get Store Status",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"outletId\\":\\"68e50210e60db7f4187e031e\\",\\"belongsTo\\":\\"685670e4486951278738864e\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/organization/get-store-status/685670e4486951278738864e",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "organization",  
                "get-store-status",  
                "685670e4486951278738864e"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Settings Get",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "Bearer {{supabase\_service\_role\_api\_key\_0so8}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"outletId\\":\\"68e50210e60db7f4187e031e\\",\\"belongsTo\\":\\"685670e4486951278738864e\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/setting/get",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "setting",  
                "get"  
              \]  
            }  
          },  
          "response": \[\]  
        }  
      \]  
    },  
    {  
      "name": "Customer",  
      "item": \[  
        {  
          "name": "Customer Login",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"phone\\":\\"919385452868\\",\\"belongsTo\\":\\"685670e4486951278738864e\\",\\"mode\\":\\"otp\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/customer/login",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "customer",  
                "login"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Verify OTP",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"phone\\":\\"919385452868\\",\\"belongsTo\\":\\"685670e4486951278738864e\\",\\"otp\\":\\"410283\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/customer/verify-otp",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "customer",  
                "verify-otp"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Customer Orders Get",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "Bearer {{json\_web\_token\_0so8}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/order/get-all-order-by-customer?page=1\&limit=20",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "order",  
                "get-all-order-by-customer"  
              \],  
              "query": \[  
                {  
                  "key": "page",  
                  "value": "1"  
                },  
                {  
                  "key": "limit",  
                  "value": "20"  
                }  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Get Addrrss by lat,lng",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "Bearer {{supabase\_service\_role\_api\_key\_0so8}}",  
                "disabled": true  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\n    \\"latitude\\": 10.777460082400633,\\n    \\"longitude\\": 79.63451395714621,\\n    \\"belongsTo\\": \\"685670e4486951278738864e\\"\\n}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/location/customer-geo-location",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "location",  
                "customer-geo-location"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Get Saved Address",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "{{bearer\_token\_1aij}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"customerPhoneNo\\":\\"919385452868\\",\\"lat\\":10.777457452521146,\\"lng\\":79.63459824075451}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/customer/get-addresses?page=1\&limit=20",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "customer",  
                "get-addresses"  
              \],  
              "query": \[  
                {  
                  "key": "page",  
                  "value": "1"  
                },  
                {  
                  "key": "limit",  
                  "value": "20"  
                }  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Get Full Address",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "Bearer {{supabase\_service\_role\_api\_key\_0so8}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"enteredAddress\\":\\"ownchat\\",\\"belongsTo\\":\\"685670e4486951278738864e\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/location/customer-get-latlng",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "location",  
                "customer-get-latlng"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Create Address",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "{{bearer\_token\_1aij}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\n    \\"address1\\": \\"76\\",\\n    \\"address2\\": \\"Nethaji Rd, Rajgopal Nagar, Santhamangalam, Kodikkalpalayam\\",\\n    \\"city\\": \\"Thiruvarur\\",\\n    \\"state\\": \\"Tamil Nadu\\",\\n    \\"country\\": \\"India\\",\\n    \\"pincode\\": \\"610001\\",\\n    \\"latitude\\": 10.7716886,\\n    \\"longitude\\": 79.63816179999999,\\n    \\"landMark\\": \\"\\",\\n    \\"type\\": \\"work\\"\\n}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/customer/create-address",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "customer",  
                "create-address"  
              \]  
            }  
          },  
          "response": \[\]  
        }  
      \]  
    },  
    {  
      "name": "Cart",  
      "item": \[  
        {  
          "name": "Get Cart details",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "Bearer {{json\_web\_token\_0so8}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\n    \\"customerPhoneNo\\": \\"919385452868\\",\\n    \\"outletId\\": \\"68e50210e60db7f4187e031e\\"\\n}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/cart/get-cart-details",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "cart",  
                "get-cart-details"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Simple Pro Cart Create",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "Bearer {{json\_web\_token\_0so8}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"items\\":\[{\\"itemId\\":\\"69c77a1a175ccba18b84d221\\",\\"quantity\\":1,\\"variationId\\":\\"\\",\\"addOnDetails\\":\[{\\"group\_id\\":\\"69c77a14175ccba18b84cfd9\\",\\"addon\_item\_ids\\":\[\\"69e87423c8d69c72cabb6407\\"\]}\],\\"currency\\":\\"INR\\"}\],\\"deliveryType\\":\\"Door Delivery\\",\\"orderType\\":\\"Door Delivery\\",\\"customerName\\":\\"Safinamoideen\\",\\"customerPhoneNo\\":\\"919385452868\\",\\"instruction\\":\\"\\",\\"addressId\\":\\"6a5074361d5a14c9230a618a\\",\\"outletId\\":\\"68e50210e60db7f4187e031e\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/cart/create",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "cart",  
                "create"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Update Cart With Addon",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "Bearer {{json\_web\_token\_0n8u}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"items\\":\[{\\"itemId\\":\\"6a47374f33486b0991abfeee\\",\\"quantity\\":1,\\"variationId\\":\\"\\",\\"addOnDetails\\":\[{\\"group\_id\\":\\"6a47374e33486b0991abfcc1\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd92491\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfccf\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd92499\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfce6\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924a4\\",\\"6a47374ea22b80a9bdd924a6\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfcfc\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924af\\"\]}\],\\"currency\\":\\"INR\\"}\],\\"deliveryType\\":\\"Door Delivery\\",\\"orderType\\":\\"Door Delivery\\",\\"customerName\\":\\"Safinamoideen\\",\\"customerPhoneNo\\":\\"919385452868\\",\\"instruction\\":\\"\\",\\"addressId\\":\\"6a5074361d5a14c9230a618a\\",\\"orderId\\":\\"20260703153155004569\\",\\"outletId\\":\\"6a47361e1898af1200d559e1\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/cart/update",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "cart",  
                "update"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Variation Product Cart update",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "{{bearer\_token\_18e2}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"items\\":\[{\\"itemId\\":\\"6a47374f33486b0991abfeee\\",\\"quantity\\":1,\\"variationId\\":\\"\\",\\"addOnDetails\\":\[{\\"group\_id\\":\\"6a47374e33486b0991abfcc1\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd92491\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfccf\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd92499\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfce6\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924a4\\",\\"6a47374ea22b80a9bdd924a6\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfcfc\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924af\\"\]}\],\\"currency\\":\\"INR\\"},{\\"itemId\\":\\"6a47375233486b0991ac17fe\\",\\"quantity\\":1,\\"variationId\\":\\"\\",\\"addOnDetails\\":\[{\\"group\_id\\":\\"6a47374e33486b0991abfcfc\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924af\\"\]}\],\\"currency\\":\\"INR\\"},{\\"itemId\\":\\"6a47375233486b0991ac18a3\\",\\"quantity\\":1,\\"variationId\\":\\"6a473752a22b80a9bdd92c20\\",\\"addOnDetails\\":\[\],\\"currency\\":\\"INR\\"}\],\\"deliveryType\\":\\"Door Delivery\\",\\"orderType\\":\\"Door Delivery\\",\\"customerName\\":\\"Safinamoideen\\",\\"customerPhoneNo\\":\\"919385452868\\",\\"instruction\\":\\"\\",\\"addressId\\":\\"6a5074361d5a14c9230a618a\\",\\"orderId\\":\\"20260703153155004569\\",\\"outletId\\":\\"6a47361e1898af1200d559e1\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/cart/update",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "cart",  
                "update"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Same variation with customize addon cart update",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "{{bearer\_token\_18e2}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\n    \\"items\\": \[\\n        {\\n            \\"itemId\\": \\"6a47374f33486b0991abfeee\\",\\n            \\"quantity\\": 1,\\n            \\"variationId\\": \\"\\",\\n            \\"addOnDetails\\": \[\\n                {\\n                    \\"group\_id\\": \\"6a47374e33486b0991abfcc1\\",\\n                    \\"addon\_item\_ids\\": \[\\n                        \\"6a47374ea22b80a9bdd92491\\"\\n                    \]\\n                },\\n                {\\n                    \\"group\_id\\": \\"6a47374e33486b0991abfccf\\",\\n                    \\"addon\_item\_ids\\": \[\\n                        \\"6a47374ea22b80a9bdd92499\\"\\n                    \]\\n                },\\n                {\\n                    \\"group\_id\\": \\"6a47374e33486b0991abfce6\\",\\n                    \\"addon\_item\_ids\\": \[\\n                        \\"6a47374ea22b80a9bdd924a4\\",\\n                        \\"6a47374ea22b80a9bdd924a6\\"\\n                    \]\\n                },\\n                {\\n                    \\"group\_id\\": \\"6a47374e33486b0991abfcfc\\",\\n                    \\"addon\_item\_ids\\": \[\\n                        \\"6a47374ea22b80a9bdd924af\\"\\n                    \]\\n                }\\n            \],\\n            \\"currency\\": \\"INR\\"\\n        },\\n        {\\n            \\"itemId\\": \\"6a47375233486b0991ac17fe\\",\\n            \\"quantity\\": 1,\\n            \\"variationId\\": \\"\\",\\n            \\"addOnDetails\\": \[\\n                {\\n                    \\"group\_id\\": \\"6a47374e33486b0991abfcfc\\",\\n                    \\"addon\_item\_ids\\": \[\\n                        \\"6a47374ea22b80a9bdd924af\\"\\n                    \]\\n                }\\n            \],\\n            \\"currency\\": \\"INR\\"\\n        },\\n        {\\n            \\"itemId\\": \\"6a47375233486b0991ac18a3\\",\\n            \\"quantity\\": 1,\\n            \\"variationId\\": \\"6a473752a22b80a9bdd92c20\\",\\n            \\"addOnDetails\\": \[\\n                {\\n                    \\"group\_id\\": \\"6a47374e33486b0991abfcdb\\",\\n                    \\"addon\_item\_ids\\": \[\\n                        \\"6a47374ea22b80a9bdd924a0\\"\\n                    \]\\n                },\\n                {\\n                    \\"group\_id\\": \\"6a47374e33486b0991abfce6\\",\\n                    \\"addon\_item\_ids\\": \[\\n                        \\"6a47374ea22b80a9bdd924a5\\",\\n                        \\"6a47374ea22b80a9bdd924a6\\",\\n                        \\"6a47374ea22b80a9bdd924a7\\",\\n                        \\"6a47374ea22b80a9bdd924a4\\"\\n                    \]\\n                }\\n            \],\\n            \\"currency\\": \\"INR\\"\\n        },\\n        {\\n            \\"itemId\\": \\"6a47375233486b0991ac18a3\\",\\n            \\"quantity\\": 1,\\n            \\"variationId\\": \\"6a473752a22b80a9bdd92c20\\",\\n            \\"addOnDetails\\": \[\\n                {\\n                    \\"group\_id\\": \\"6a47374e33486b0991abfcc1\\",\\n                    \\"addon\_item\_ids\\": \[\\n                        \\"6a47374ea22b80a9bdd92490\\"\\n                    \]\\n                },\\n                {\\n                    \\"group\_id\\": \\"6a47374e33486b0991abfccf\\",\\n                    \\"addon\_item\_ids\\": \[\\n                        \\"6a47374ea22b80a9bdd92499\\"\\n                    \]\\n                },\\n                {\\n                    \\"group\_id\\": \\"6a47374e33486b0991abfcdb\\",\\n                    \\"addon\_item\_ids\\": \[\\n                        \\"6a47374ea22b80a9bdd9249f\\"\\n                    \]\\n                },\\n                {\\n                    \\"group\_id\\": \\"6a47374e33486b0991abfce6\\",\\n                    \\"addon\_item\_ids\\": \[\\n                        \\"6a47374ea22b80a9bdd924a4\\",\\n                        \\"6a47374ea22b80a9bdd924a5\\"\\n                    \]\\n                }\\n            \],\\n            \\"currency\\": \\"INR\\"\\n        }\\n    \],\\n    \\"deliveryType\\": \\"Door Delivery\\",\\n    \\"orderType\\": \\"Door Delivery\\",\\n    \\"customerName\\": \\"Safinamoideen\\",\\n    \\"customerPhoneNo\\": \\"919385452868\\",\\n    \\"instruction\\": \\"\\",\\n    \\"addressId\\": \\"6a5074361d5a14c9230a618a\\",\\n    \\"orderId\\": \\"20260703153155004569\\",\\n    \\"outletId\\": \\"6a47361e1898af1200d559e1\\"\\n}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/cart/update",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "cart",  
                "update"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Delete item",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "Bearer {{supabase\_service\_role\_api\_key\_0n8u}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"outletId\\":\\"6a47361e1898af1200d559e1\\",\\"orderId\\":\\"20260703153155004569\\",\\"itemid\\":\\"6a50779e7dff833360da9f8e\\",\\"customerPhoneNo\\":\\"919385452868\\",\\"customerName\\":\\"Safinamoideen\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/cart/delete/item",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "cart",  
                "delete",  
                "item"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Instruction update",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "{{bearer\_token\_18e2}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"orderId\\":\\"20260703153155004569\\",\\"outletId\\":\\"6a47361e1898af1200d559e1\\",\\"customerPhoneNo\\":\\"919385452868\\",\\"customerName\\":\\"Safinamoideen\\",\\"deliveryType\\":\\"Door Delivery\\",\\"orderType\\":\\"Door Delivery\\",\\"items\\":\[{\\"itemId\\":\\"6a47375233486b0991ac17fe\\",\\"quantity\\":1,\\"variationId\\":\\"\\",\\"addOnDetails\\":\[{\\"group\_id\\":\\"6a47374e33486b0991abfcfc\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924af\\"\]}\],\\"currency\\":\\"INR\\"},{\\"itemId\\":\\"6a47375233486b0991ac18a3\\",\\"quantity\\":1,\\"variationId\\":\\"6a473752a22b80a9bdd92c20\\",\\"addOnDetails\\":\[{\\"group\_id\\":\\"6a47374e33486b0991abfcdb\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924a0\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfce6\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924a5\\",\\"6a47374ea22b80a9bdd924a6\\",\\"6a47374ea22b80a9bdd924a7\\",\\"6a47374ea22b80a9bdd924a4\\"\]}\],\\"currency\\":\\"INR\\"},{\\"itemId\\":\\"6a47375233486b0991ac18a3\\",\\"quantity\\":1,\\"variationId\\":\\"6a473752a22b80a9bdd92c20\\",\\"addOnDetails\\":\[{\\"group\_id\\":\\"6a47374e33486b0991abfcc1\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd92490\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfccf\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd92499\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfcdb\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd9249f\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfce6\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924a4\\",\\"6a47374ea22b80a9bdd924a5\\"\]}\],\\"currency\\":\\"INR\\"}\],\\"instruction\\":\\"special instruc\\",\\"addressId\\":\\"6a5074361d5a14c9230a618a\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/cart/update",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "cart",  
                "update"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Order Type Update",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "Bearer {{supabase\_service\_role\_api\_key\_0n8u}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"orderId\\":\\"20260703153155004569\\",\\"outletId\\":\\"6a47361e1898af1200d559e1\\",\\"customerPhoneNo\\":\\"919385452868\\",\\"customerName\\":\\"Safinamoideen\\",\\"deliveryType\\":\\"Self Pickup\\",\\"orderType\\":\\"Self Pickup\\",\\"items\\":\[{\\"itemId\\":\\"6a47375233486b0991ac17fe\\",\\"quantity\\":1,\\"variationId\\":\\"\\",\\"addOnDetails\\":\[{\\"group\_id\\":\\"6a47374e33486b0991abfcfc\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924af\\"\]}\],\\"currency\\":\\"INR\\"},{\\"itemId\\":\\"6a47375233486b0991ac18a3\\",\\"quantity\\":1,\\"variationId\\":\\"6a473752a22b80a9bdd92c20\\",\\"addOnDetails\\":\[{\\"group\_id\\":\\"6a47374e33486b0991abfcdb\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924a0\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfce6\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924a5\\",\\"6a47374ea22b80a9bdd924a6\\",\\"6a47374ea22b80a9bdd924a7\\",\\"6a47374ea22b80a9bdd924a4\\"\]}\],\\"currency\\":\\"INR\\"},{\\"itemId\\":\\"6a47375233486b0991ac18a3\\",\\"quantity\\":1,\\"variationId\\":\\"6a473752a22b80a9bdd92c20\\",\\"addOnDetails\\":\[{\\"group\_id\\":\\"6a47374e33486b0991abfcc1\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd92490\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfccf\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd92499\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfcdb\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd9249f\\"\]},{\\"group\_id\\":\\"6a47374e33486b0991abfce6\\",\\"addon\_item\_ids\\":\[\\"6a47374ea22b80a9bdd924a4\\",\\"6a47374ea22b80a9bdd924a5\\"\]}\],\\"currency\\":\\"INR\\"}\],\\"instruction\\":\\"special instruc\\",\\"addressId\\":\\"6a5074361d5a14c9230a618a\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/cart/update",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "cart",  
                "update"  
              \]  
            }  
          },  
          "response": \[\]  
        }  
      \]  
    },  
    {  
      "name": "Product",  
      "item": \[  
        {  
          "name": "Get Category with item",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Cache-Control",  
                "value": "no-cache"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Pragma",  
                "value": "no-cache"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\n    \\"outletId\\": \\"6a47361e1898af1200d559e1\\",\\n    \\"belongsTo\\": \\"685670e4486951278738864e\\",\\n    \\"customerId\\": \\"69c79aff6d0f297e92fec96d\\"\\n}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/category/getCategory",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "category",  
                "getCategory"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Get Item Detaik",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"itemId\\":\\"6a47374f33486b0991abfeee\\",\\"outletId\\":\\"6a47361e1898af1200d559e1\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/item/getItemDetail",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "item",  
                "getItemDetail"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Get item detail with variation",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"itemId\\":\\"6a47375233486b0991ac18dc\\",\\"variationid\\":\\"6a473752a22b80a9bdd92c4a\\",\\"outletId\\":\\"6a47361e1898af1200d559e1\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/item/getItemDetail",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "item",  
                "getItemDetail"  
              \]  
            }  
          },  
          "response": \[\]  
        }  
      \]  
    },  
    {  
      "name": "Discount",  
      "item": \[  
        {  
          "name": "Get Customer Discounts",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "Bearer {{supabase\_service\_role\_api\_key\_0n8u}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"outletId\\":\\"6a47361e1898af1200d559e1\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/discount/get-user-discounts",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "discount",  
                "get-user-discounts"  
              \]  
            }  
          },  
          "response": \[\]  
        },  
        {  
          "name": "Discount Apply",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Authorization",  
                "value": "Bearer {{supabase\_service\_role\_api\_key\_0n8u}}"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"outletId\\":\\"6a47361e1898af1200d559e1\\",\\"code\\":\\"\\",\\"orderId\\":\\"20260703153155004569\\",\\"discountId\\":\\"6a473c8da22b80a9bdd93043\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/discount/applyToCart",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "discount",  
                "applyToCart"  
              \]  
            }  
          },  
          "response": \[\]  
        }  
      \]  
    },  
    {  
      "name": "Banner",  
      "item": \[  
        {  
          "name": "Customer Get",  
          "request": {  
            "method": "POST",  
            "header": \[  
              {  
                "key": "Accept",  
                "value": "application/json, text/plain, \*/\*"  
              },  
              {  
                "key": "Accept-Language",  
                "value": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,ta;q=0.6,bn;q=0.5,kn;q=0.4"  
              },  
              {  
                "key": "Cache-Control",  
                "value": "no-cache"  
              },  
              {  
                "key": "Connection",  
                "value": "keep-alive"  
              },  
              {  
                "key": "Content-Type",  
                "value": "application/json"  
              },  
              {  
                "key": "Origin",  
                "value": "https://ieyal.foodably.in"  
              },  
              {  
                "key": "Pragma",  
                "value": "no-cache"  
              },  
              {  
                "key": "Referer",  
                "value": "https://ieyal.foodably.in/"  
              },  
              {  
                "key": "Sec-Fetch-Dest",  
                "value": "empty"  
              },  
              {  
                "key": "Sec-Fetch-Mode",  
                "value": "cors"  
              },  
              {  
                "key": "Sec-Fetch-Site",  
                "value": "cross-site"  
              },  
              {  
                "key": "User-Agent",  
                "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10\_15\_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"  
              },  
              {  
                "key": "sec-ch-ua",  
                "value": "\\"Google Chrome\\";v=\\"149\\", \\"Chromium\\";v=\\"149\\", \\"Not)A;Brand\\";v=\\"24\\""  
              },  
              {  
                "key": "sec-ch-ua-mobile",  
                "value": "?0"  
              },  
              {  
                "key": "sec-ch-ua-platform",  
                "value": "\\"macOS\\""  
              }  
            \],  
            "body": {  
              "mode": "raw",  
              "raw": "{\\"outletId\\":\\"68e50210e60db7f4187e031e\\",\\"belongsTo\\":\\"685670e4486951278738864e\\"}",  
              "options": {  
                "raw": {  
                  "language": "json"  
                }  
              }  
            },  
            "url": {  
              "raw": "https://backend2.owct.me/banner/get-active",  
              "protocol": "https",  
              "host": \[  
                "backend3",  
                "owct",  
                "me"  
              \],  
              "path": \[  
                "banner",  
                "get-active"  
              \]  
            }  
          },  
          "response": \[\]  
        }  
      \]  
    }  
  \],  
  "variable": \[  
    {  
      "key": "json\_web\_token\_0so8",  
      "secret": true  
    },  
    {  
      "key": "bearer\_token\_1aij",  
      "secret": true  
    },  
    {  
      "key": "supabase\_service\_role\_api\_key\_0so8",  
      "secret": true  
    },  
    {  
      "key": "json\_web\_token\_0n8u",  
      "secret": true  
    },  
    {  
      "key": "bearer\_token\_18e2",  
      "secret": true  
    },  
    {  
      "key": "supabase\_service\_role\_api\_key\_0n8u",  
      "secret": true  
    }  
  \]  
}  
