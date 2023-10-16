import jwt_decode from "jwt-decode";

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJpZmF0QGdtYWlsNC5jb20iLCJyb2xlIjoiZmFjdWx0eSIsImlhdCI6MTY5NzM1MTQ0NSwiZXhwIjoxNjk3OTU2MjQ1fQ.dnakYtJJy3-elg-YEKLsKAPbGgu11R7lt09gFeU8U8Y';
const decoded = jwt_decode(token);
console.log(decoded)


const date = new Date().getTime();


console.log(date)