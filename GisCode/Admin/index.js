 var express = require("express");
 const session = require('express-session');
 var app = express();
 app.use(session({
     resave: true,
     saveUninitialized: true,
     secret: 'somesecret',
     cookie: { maxAge: 60000 }
 }));

 app.use(express.static("public"));
 app.set("view engine", "ejs");
 app.set("views", "./views");
 app.listen(3000);
 var http = require('http').createServer(app);

 var bodyParser = require('body-parser');
 var urlencodedParser = bodyParser.urlencoded({ extended: false });
 var pg = require('pg');
 var config = {
     user: 'postgres',
     database: 'qlbenh',
     password: 'admin',
     host: 'localhost',
     port: 5432,
     max: 10,
     idleTimeoutMillis: 30000,
 }
 var pool = new pg.Pool(config);

 app.use('/public', express.static('public'));

 app.get("/quantri/list", function(req, res) {
     pool.connect((err, client, release) => {
         if (req.session.username) {
             if (err) {
                 return console.error('Error acquiring client', err.stack)
             }
             client.query("SELECT * FROM bn_point ", (err, result) => {
                 release()
                 if (err) {
                     res.end();
                     return console.error('Error executing query', err.stack)
                 }

                 // console.log(result.rows[0].ten_chu_ho);
                 res.render("quantri.ejs", { danhsach: result });

             });
         } else {
             res.redirect('/login');
         }

     });
 });

 app.get("/quantri/dmquyetdinh", function(req, res) {
     pool.connect((err, client, release) => {
         if (req.session.username) {
             if (err) {
                 return console.error('Error acquiring client', err.stack)
             }
             client.query("SELECT * FROM dmquyetdinh ", (err, result) => {
                 release()
                 if (err) {
                     res.end();
                     return console.error('Error executing query', err.stack)
                 }

                 // console.log(result.rows[0].ten_chu_ho);
                 res.render("quyetdinh.ejs", { danhsach: result });

             });
         } else {
             res.redirect('/login');
         }

     });
 });

 app.get("/quantri/thihanh", function(req, res) {
     pool.connect((err, client, release) => {
         if (req.session.username) {
             if (err) {
                 return console.error('Error acquiring client', err.stack)
             }
             client.query("select cb.tencb, cb.chucvu,qd.ngayqd,qd.noidung,th.ngayth,th.noithuchien,th.tinhtrang from thihanh th join dmcanbo cb on th.macb = cb.macb join dmquyetdinh qd on qd.maqd = th.maqd ", (err, result) => {
                 release()
                 if (err) {
                     res.end();
                     return console.error('Error executing query', err.stack)
                 }

                 // console.log(result.rows[0].ten_chu_ho);
                 res.render("thihanh.ejs", { danhsach: result });

             });
         } else {
             res.redirect('/login');
         }

     });
 });

 app.get("/quantri/benhtnlist", function(req, res) {
     pool.connect((err, client, release) => {
         if (req.session.username) {
             if (err) {
                 return console.error('Error acquiring client', err.stack)
             }
             client.query("SELECT * FROM dmbenhtn ", (err, result) => {
                 release()
                 if (err) {
                     res.end();
                     return console.error('Error executing query', err.stack)
                 }

                 // console.log(result.rows[0].ten_chu_ho);
                 res.render("benhtn.ejs", { danhsach: result });

             });
         } else {
             res.redirect('/login');
         }

     });
 });

 app.get("/quantri/canbo", function(req, res) {
     pool.connect((err, client, release) => {
         if (req.session.username) {
             if (err) {
                 return console.error('Error acquiring client', err.stack)
             }
             client.query("SELECT * FROM dmcanbo ", (err, result) => {
                 release()
                 if (err) {
                     res.end();
                     return console.error('Error executing query', err.stack)
                 }

                 // console.log(result.rows[0].ten_chu_ho);
                 res.render("quantri_canbo.ejs", { danhsach: result });

             });
         } else {
             res.redirect('/login');
         }
     });
 });

 app.get("/quantri/them", function(req, res) {
     //show form
     res.render("them.ejs");
 });

 app.post("/quantri/them", urlencodedParser, function(req, res) {
     //insert db
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         var mabhyt = req.body.txtmabhyt;
         var hoten = req.body.txthoten;
         var nghenghiep = req.body.txtnghenghiep;
         var diachi = req.body.txtdiachi;
         var tuoi = req.body.txttuoi;
         var gioitinh = req.body.txtgioitinh;
         var idphuong = req.body.txtidphuong;
         var tdx = req.body.txtX;
         var tdy = req.body.txtY;
         client.query("insert into bn_point (mabhyt,hoten,nghenghiep,diachi,tuoi,gioitinh,idphuong,geom) values ('" + mabhyt + "','" + hoten + "','" + nghenghiep + "','" + diachi + "','" + tuoi + "','" + gioitinh + "','" + idphuong + "','SRID=4326;POINT(" + tdx + " " + tdy + ")')", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }
             // console.log(result.rows[0].ten_chu_ho);
             res.redirect("../quantri/list");
         });
     });

 });

 app.get("/quantri/sua/:mabn", function(req, res) {
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         var mabn = req.params.mabn;
         client.query("SELECT * FROM bn_point WHERE mabn='" + mabn + "'", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }
             // console.log(result.rows[0]);

             res.render("sua.ejs", { bn: result.rows[0] });
         });
     });
 });

 app.post("/quantri/sua", urlencodedParser, function(req, res) {
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         var mabn = req.body.txtmabn;
         var mabhyt = req.body.txtmabhyt;
         var hoten = req.body.txthoten;
         var nghenghiep = req.body.txtnghenghiep;
         var diachi = req.body.txtdiachi;
         var tuoi = req.body.txttuoi;
         var gioitinh = req.body.txtgioitinh;
         var idphuong = req.body.txtidphuong;
         var geom = req.body.txtGeom;


         client.query("UPDATE bn_point SET mabhyt='" + mabhyt + "', hoten='" + hoten + "', nghenghiep='" + nghenghiep + "',diachi='" + diachi + "',tuoi='" + tuoi + "',gioitinh='" + gioitinh + "',idphuong='" + idphuong + "',geom='" + geom + "' WHERE mabn='" + mabn + "'  ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }
             // console.log(result.rows[0].ten_chu_ho);
             res.redirect("/quantri/list");
         });
     });

 })

 app.get("/quantri/xoa/:mabn", function(req, res) {
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         var mabn = req.params.mabn;
         client.query("DELETE FROM bn_point WHERE mabn='" + mabn + "' ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }
             // console.log(result.rows[0].ten_chu_ho);
             res.redirect("../../quantri/list");
         });
     });
 })

 //  app.get("/", function(req, res) {
 //      res.render("main");
 //  })

 app.get("/", function(req, res) {
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         client.query("select tn.ten, sum(case when tt.tinhtrang=N'dương tính' then 1 else 0 end) as tongca, sum(case when tt.kq_dt=N'khỏi bệnh' then 1 else 0 end) as tongcakhoibenh, sum(case when tt.kq_dt=N'tử vong' then 1 else 0 end) as tongcatuvong from tinhtrangdichbenh tt right join dmbenhtn tn on tt.mabenhtn=tn.mabenhtn group by tn.ten ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }

             //  var someAttribute = req.session.username;
             //  console.log(someAttribute);
             res.render("main.ejs", { danhsach: result, trangthai: 0 });

         });
     });
 });

 app.post("/getcabenh", urlencodedParser, function(req, res) {
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         var idphuong = req.body.idphuong;

         //  console.log(idphuong);
         client.query("select tn.ten, sum(case when tt.kq_dt=N'khỏi bệnh' then 1 else 0 end) as tongcakhoibenh, sum(case when tt.kq_dt=N'tử vong' then 1 else 0 end) as tongcatuvong from tinhtrangdichbenh tt right join dmbenhtn tn on tt.mabenhtn=tn.mabenhtn join bn_point bn on bn.mabn=tt.mabn join vungranhgioiphuongtxtdm_region ph on bn.idphuong=ph.id where ph.id=" + idphuong + " group by tn.ten ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }
             // console.log(result.rows[0].ten_chu_ho);
             res.json(result);
             //res.render("main.ejs", { ds: result, trangthai: 1 });
         });
     });

 })



 app.get("/quantri/thongke", function(req, res) {
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         client.query("select tn.ten, sum(case when tt.tinhtrang=N'dương tính' then 1 else 0 end) as tongca, sum(case when tt.kq_dt=N'khỏi bệnh' then 1 else 0 end) as tongcakhoibenh, sum(case when tt.kq_dt=N'tử vong' then 1 else 0 end) as tongcatuvong from tinhtrangdichbenh tt right join dmbenhtn tn on tt.mabenhtn=tn.mabenhtn group by tn.ten ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }

             // console.log(result.rows[0].ten_chu_ho);
             res.render("thongke.ejs", { danhsach: result });

         });
     });
 });

 app.get("/quantri/thongkengay_30", function(req, res) {
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         client.query("select tn.ten,sum(case when tt.tinhtrang=N'dương tính' then 1 else 0 end) as tongca, sum(case when tt.kq_dt=N'khỏi bệnh' then 1 else 0 end) as tongcakhoibenh,sum(case when tt.kq_dt=N'tử vong' then 1 else 0 end) as tongcatuvong from tinhtrangdichbenh tt right join dmbenhtn tn on tt.mabenhtn=tn.mabenhtn where tt.ngaynhapvien >= (now() - INTERVAL '30 DAYS')  AND  tt.ngaynhapvien <= now() group by tn.ten ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }

             // console.log(result.rows[0].ten_chu_ho);
             res.render("thongkengay_30.ejs", { danhsach: result });

         });
     });
 });

 app.get("/quantri/thongkengay_15", function(req, res) {
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         client.query("select tn.ten,sum(case when tt.tinhtrang=N'dương tính' then 1 else 0 end) as tongca, sum(case when tt.kq_dt=N'khỏi bệnh' then 1 else 0 end) as tongcakhoibenh,sum(case when tt.kq_dt=N'tử vong' then 1 else 0 end) as tongcatuvong from tinhtrangdichbenh tt right join dmbenhtn tn on tt.mabenhtn=tn.mabenhtn where tt.ngaynhapvien >= (now() - INTERVAL '15 DAYS')  AND  tt.ngaynhapvien <= now() group by tn.ten ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }

             // console.log(result.rows[0].ten_chu_ho);
             res.render("thongkengay_15.ejs", { danhsach: result });

         });
     });
 });

 app.get("/quantri/thongkephuong", function(req, res) {
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         client.query("select ph.tenphuong, tn.ten, sum(case when tt.kq_dt=N'khỏi bệnh' then 1 else 0 end) as tongcakhoibenh, sum(case when tt.kq_dt=N'tử vong' then 1 else 0 end) as tongcatuvong from tinhtrangdichbenh tt right join dmbenhtn tn on tt.mabenhtn=tn.mabenhtn join bn_point bn on bn.mabn=tt.mabn join vungranhgioiphuongtxtdm_region ph on bn.idphuong=ph.id group by tn.ten, ph.tenphuong ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }

             // console.log(result.rows[0].ten_chu_ho);
             res.render("thongke_phuong.ejs", { danhsach: result });

         });
     });
 });

 app.get("/quantri/xoatt/:id", function(req, res) {
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         var id = req.params.id;
         client.query("DELETE FROM tinhtrangdichbenh WHERE id='" + id + "' ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }
             // console.log(result.rows[0].ten_chu_ho);
             res.redirect("../../quantri/ttlist");
         });
     });
 })

 app.get("/login", function(req, res) {
     res.sendFile('/login.html', { root: __dirname });
 });

 app.post("/login", urlencodedParser, function(req, res) {
     var username = req.body.username;
     var password = req.body.password;
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         client.query("SELECT * FROM user WHERE tk='" + username + "' AND mk='" + password + "'  LIMIT 1", [username, password], function(err, result) {
             release()
             if (username == 'admin_yte') {

                 var sessData = req.session;
                 sessData.username = username;

                 res.redirect("/quantri/list");


             } else {
                 var sessData = req.session;
                 sessData.username = username;
                 res.redirect("/quantri/canbo");
             }

         });

     });
 });



 app.get("/logout", function(req, res) {
     //show form
     req.session.destroy();
     res.redirect("/");
 });

 app.get("/quantri/ttlist", function(req, res) {
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         client.query("select tt.*, tn.ten from tinhtrangdichbenh tt right join dmbenhtn tn on tt.mabenhtn=tn.mabenhtn ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }

             // console.log(result.rows[0].ten_chu_ho);
             res.render("tinhtrang.ejs", { danhsach: result });

         });
     });
 });



 app.get("/quantri/themtt", function(req, res) {
     //show form
     res.render("themtt.ejs");
 });

 app.post("/quantri/themtt", urlencodedParser, function(req, res) {
     //insert db
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         var mabn = req.body.txtmabn;
         var mabenhtn = req.body.txtmabenhtn;
         var tinhtrang = req.body.txttinhtrang;
         var kq_dt = req.body.txtkq_dt;
         var ngaynv = req.body.txtngaynv;

         client.query("insert into tinhtrangdichbenh (mabn,mabenhtn,ngaynhapvien,tinhtrang,kq_dt) values ('" + mabn + "','" + mabenhtn + "','" + ngaynv + "','" + tinhtrang + "','" + kq_dt + "') ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }
             // console.log(result.rows[0].ten_chu_ho);
             res.redirect("../quantri/ttlist");
         });
     });

 });
 app.get("/quantri/suatt/:id", function(req, res) {
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         var id = req.params.id;
         client.query("SELECT * FROM tinhtrangdichbenh WHERE id='" + id + "'", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }
             // console.log(result.rows[0]);

             res.render("suatt.ejs", { bn: result.rows[0] });
         });
     });
 });
 app.post("/quantri/suatt", urlencodedParser, function(req, res) {
     //insert db
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         var mabn = req.body.txtmabn;
         var mabenhtn = req.body.txtmabenhtn;
         var tinhtrang = req.body.txttinhtrang;
         var kq_dt = req.body.txtkq_dt;
         var ngaynv = req.body.txtngaynv;

         client.query("UPDATE tinhtrangdichbenh SET mabenhtn='" + mabenhtn + "',ngaynhapvien='" + ngaynv + "', tinhtrang='" + tinhtrang + "', kq_dt='" + kq_dt + "' WHERE mabn='" + mabn + "'  ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }
             // console.log(result.rows[0].ten_chu_ho);
             res.redirect("/quantri/ttlist");
         });
     });

 });

 app.get("/quantri/listyt", function(req, res) {
     pool.connect((err, client, release) => {

         if (err) {
             return console.error('Error acquiring client', err.stack)
         }
         client.query("SELECT * FROM tramyte_point ", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }

             // console.log(result.rows[0].ten_chu_ho);
             res.render("quantri_yt.ejs", { danhsach: result });

         });


     });
 });

 app.get("/quantri/themtramyt", function(req, res) {
     //show form
     res.render("themyt.ejs");
 });

 app.post("/quantri/themtramyt", urlencodedParser, function(req, res) {
     //insert db
     pool.connect((err, client, release) => {
         if (err) {
             return console.error('Error acquiring client', err.stack)
         }

         var hoten = req.body.txthoten;
         var nghenghiep = req.body.txtnghenghiep;
         var diachi = req.body.txtdiachi;
         var tuoi = req.body.txttuoi;
         var gioitinh = req.body.txtgioitinh;

         var tdx = req.body.txtX;
         var tdy = req.body.txtY;
         client.query("insert into tramyte_point (tentram,diachi,phuong,quymo,dt,geom) values ('" + hoten + "','" + nghenghiep + "','" + diachi + "','" + tuoi + "','" + gioitinh + "','SRID=4326;POINT(" + tdx + " " + tdy + ")')", (err, result) => {
             release()
             if (err) {
                 res.end();
                 return console.error('Error executing query', err.stack)
             }
             // console.log(result.rows[0].ten_chu_ho);
             res.redirect("../quantri/listyt");
         });
     });

 });