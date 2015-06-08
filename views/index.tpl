<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Demo</title>
    <link href="../static/css/bootstrap.min.css" rel="stylesheet">
    <script type="text/javascript" src="../static/js/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="../static/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../static/js/func.js"></script>
  </head>
  <body>
    <form>
      <div class="form-group">
        <label for="inputname">Name</label>
        <input type="text" id="name" class="form-control" placeholder="Enter name"><br>
      </div>
      <div class="form-group">
        <label for="inputage">Age</label>
        <input type="text" id="age" class="form-control" placeholder="Enter age"><br>
      </div>
      <div class="form-group">
        <label for="inputname">Email</label>
        <input type="email" id="email" class="form-control" placeholder="Enter Email"><br>
      </div>
      <div class="form-group">
        <label for="inputeducation">Education</label>
        <input type="text" id="education" class="form-control" placeholder="Enter education"><br>
      </div>
      <div class="form-group">
        <label for="inputexperience">Experience</label>
        <input type="text" id="experience" class="form-control" placeholder="Enter experience"><br>
      </div>
      <div class="form-group">
        <label for="inputphone">Phone</label>
        <input type="text" id="phone" class="form-control" placeholder="Enter phone"><br>
      </div>
      <div class="form-group">
        <label for="inputmobile">Mobile</label>
        <input type="text" id="mobile" class="form-control" placeholder="Enter mobile"><br>
      </div>
      <div class="form-group">
        <label for="inputcomment">Comment</label>
        <input type="text" id="comment" class="form-control" placeholder="Enter comment"><br>
      </div>
      <div class="form-group">
        <label for="inputcomment">Resume</label>
        <input type="file" id="uploadresume" name="uploadresume"></input>
        <button id="btnuploadresume" type="type" class="btn btn-default">Upload</button>
      </div>
      
      <button id="btnsubmit" class="btn btn-default">Submit</button>
    </form>
  </body>
</html>