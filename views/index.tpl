<!DOCTYPE html>
<html>
  <head>
    <title>Demo</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <link href="../static/css/bootstrap.min.css" rel="stylesheet">
    <link href="../static/css/bootstrap-theme.min.css" rel="stylesheet">
    <script type="text/javascript" src="../static/js/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="../static/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../static/js/func.js"></script>
    
  </head>
  <body>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Demo</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Create <span class="sr-only">(current)</span></a></li>
            <li><a href="/view">View</a></li>
          </ul>
          <form class="navbar-form navbar-left" role="search">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Search">
            </div>
            <button type="submit" class="btn btn-default">Search</button>
          </form>
          </div><!-- /.navbar-collapse -->
          </div><!-- /.container-fluid -->
        </nav>
        <div class="container">
          <div class="row">
            <div class="col-md-1 col-lg-12"  style="background-color: #dedef8; box-shadow: inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
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
                <form enctype="multipart/form-data">
                  <label>Resume</label>
                  <input type="file" id="uploadresume" name="uploadresume"></input><button id="btnuploadresume" type="button" >Upload</button>
                </form>
              <progress></progress>
              <button id="btnsubmit" class="btn btn-default">Submit</button>
            </form>
            
          </div>
        </div>
        
      </body>
    </html>