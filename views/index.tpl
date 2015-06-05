<!DOCTYPE html>
<html>
  <head>
    <title>Demo</title>
    <script type="text/javascript" src="../static/js/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="../static/js/func.js"></script>
    <script type="text/javascript" src="../static/js/jquery-file-upload-9.10.0/js/vendor/jquery.ui.widget.js"></script>
    <script type="text/javascript" src="../static/js/jquery-file-upload-9.10.0/js/jquery.iframe-transport.js"></script>
    <script type="text/javascript" src="../static/js/jquery-file-upload-9.10.0/js/jquery.fileupload.js"></script>
  </head>
  <body>
    <div>
      Name:<input type="text" id="name"><br>
      Age:<input type="text" id="age"><br>
      Email:<input type="text" id="email"><br>
      Education:<input type="text" id="education"><br>
      Experience:<input type="text" id="experience"><br>
      Phone:<input type="text" id="experience"><br>
      Mobile:<input type="text" id="mobile"><br>
      <div>
        <form enctype="multipart/form-data" action="/uploadresume" method="post">
          Resume: <input type="file" id="uploadresume" name="uploadresume"></input>
          <input type="submit" value="Upload" id = "btnuploadresume"/>
        </form>
        
      </div>
      <button id="btnsubmit">Submit</button>
    </div>
  </body>
</html>