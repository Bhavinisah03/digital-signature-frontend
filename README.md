# Digital signature application

### Dependencies to be installed - Linux/Mac
1. For Login and RSS Encryption ```pip install cryptography``` - 
2. For Login ```pip install python-jose```
3. For SQLite Database ```pip install sqlalchemy```
4. For Password Encryption and Login Setup ```pip install bcrypt - ```
5. For FastAPI ```pip install fastapi```

### Manually Create table author_messages ->
1. Goto to <digital-signature-service/db directory>
```
cd <digital-signature-service/db directory>
```
2. Open digital_signatures database in sqlite3
```
sqlite3 digital_signatures.db
```
3. Run the following command to create table
```
CREATE TABLE author_messages ( author_id INTEGER NOT NULL, private_key_id INTEGER NOT NULL, message TEXT NOT NULL, signature TEXT NOT NULL );
```
4. Run ```.exit``` command to quit

### Check entries in author_messages table
1. Goto to <digital-signature-service/db directory> 
```
cd <digital-signature-service/db directory>
```
2. Open digital_signatures database in sqlite3 
```
sqlite3 digital_signatures.db
```
3. Check records in author_messages
```
select * from  author_messages;
select count(*) from  author_messages;
```
4. Run ```.exit``` command to quit

### Manually Create table user_credentials ->
1. Goto to <digital-signature-service/db directory>
```
cd <digital-signature-service/db directory>
```
2. Open digital_signatures database in sqlite3
```
sqlite3 digital_signatures.db
```
3. Run the following command to create table
```
3. CREATE TABLE user_credentials ( email TEXT NOT NULL, password TEXT NOT NULL, user_type TEXT NOT NULL, PRIMARY KEY (email, user_type));
```
4. Run ```.exit``` command to quit

### Check entries in user_credentials table
1. Goto to <digital-signature-service/db directory>
```
cd <digital-signature-service/db directory>
```
2. Open digital_signatures database in sqlite3
```
sqlite3 digital_signatures.db
```
3. Check records in user_credentials
```
select * from  user_credentials;
select count(*) from  user_credentials;
```
4. Run ```.exit``` command to quit

### How to run backend server
1. Goto to <digital-signature-service source directory>
```
cd <digital-signature-service/src directory>
```
2. run FastAPI backend server using the following command
```
fastapi dev main.py
```
3. Goto http://127.0.0.1:8000/docs to see APIs

### How to Create new credentials
1. Make sure backend server is running
2. Goto http://127.0.0.1:8000/docs#/default/add_or_update_user_credentials_add_or_update_user_credentials__post
2. Click on “Try it now”
3. Enter email and password. Example input
```
{ 
    "email": "bhavini.2@gmail.com", 
    "password": "authortest1", 
    "user_type": "Author" 
}
```
4. Click on “Execute"
5. API Response should also return { "status" : "Success" }. You can also validate by Checking entries in user_credentials table.

### How to run website
1. Goto to <digital-signature-frontend directory>
```
cd <digital-signature-frontend directory>
```
2. Open frontend code in local server using python on port 8001
```
python -m http.server 8001
```
3. Goto http://127.0.0.1:8001/login.html

### How to create signature
1. Goto to http://127.0.0.1:8001/login.html 
2. Use credentials and Click on Login 
3. It will redirect you to http://127.0.0.1:8001/generate_signature.html
4. Enter a message to sign:
5. Click on Sign Message 
6. Signature is generated in “Signed Version of the message through RSA algorithm:” block

### How to validate signature
1. Goto Goto to http://127.0.0.1:8001/verify_signature.html
2. Enter message to be verified. It should be message generated in [How to create signature](#how-to-create-signature) Step 4
3. Enter Signature to be verified. It should be message generated in [How to create signature](#how-to-create-signature) Step 6
4. Enter sender's email. It should be message generated in [How to create signature](#how-to-create-signature) Step 2
5. Click on “Verify Signature”
6. If signature is valid “Signature provided is valid!” message will be populated in “Verification Result” section other wise “Signature provided is invalid!” Message will be populate.
