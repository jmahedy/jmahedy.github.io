ECHO

curl -X POST \
  https://upload.box.com/api/2.0/files/content \
  -H 'Accept: */*' \
  -H 'Authorization: Bearer WFSlNQMt6OBA4nh13i6CxFFHGA4GRGeX' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Host: upload.box.com' \
  -H 'Postman-Token: b8fa57ce-3ae4-4b88-a204-5d1b66927255,f988cdf4-f38b-4d3d-aa5e-07518cd28b6f' \
  -H 'User-Agent: PostmanRuntime/7.11.0' \
  -H 'accept-encoding: gzip, deflate' \
  -H 'cache-control: no-cache' \
  -H 'content-length: 445' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F 'attributes={"name":"rfiddata002.xml", "parent": {"id": "76628355894"}}' \
  -F file=@/Users/jmahedy/Documents/Development/githr/jmahedy.github.io/NWR/RFID/rfiddata002.xml
