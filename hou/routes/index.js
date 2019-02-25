var express = require('express');
var router = express.Router();
var Mongo = require("mongodb-curd");
var batabaseName = "test11";
var collcationName = "chengyuan";

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//添加
router.post('/api/insert', function(req, res, next) {
    var name = req.body.name;
    var agx = req.body.agx;
    if (name == "" || agx == "") {
        res.send({ code: 1, msg: "用户名或性别为空" })
    }
    Mongo.insert(batabaseName, collcationName, { "name": name, "agx": agx }, function(data) {
        if (data) {
            res.send({ code: 1, mgs: "添加成功", data: data })
        } else {
            res.send({ code: 0, mgs: "添加失败" })
        }
    })
});

//查找全部
router.post('/api/find', function(req, res, next) {
    Mongo.find(batabaseName, collcationName, function(data) {
        if (data) {
            res.send({ code: 1, mgs: "查询成功", data: data })
        } else {
            res.send({ code: 0, mgs: "查询失败" })
        }
    })
});

//模糊搜索
router.post('/api/mohu', function(req, res, next) {
    var reg = new RegExp(req.body.name);
    Mongo.find(batabaseName, collcationName, { "name": reg }, function(data) {
        if (data) {
            res.send({ code: 1, mgs: "查询成功", data: data })
        } else {
            res.send({ code: 0, mgs: "查询失败" })
        }
    })
});

//删除
router.post('/api/remove', function(req, res, next) {
    var id = req.body.id;
    if (!id) {
        res.send({ code: 1, mgs: "ID为空" });
    }
    Mongo.remove(batabaseName, collcationName, { "_id": id }, function(data) {
        console.log(data);
        if (data.deletdeCount == 0) {
            res.send({ code: 1, mgs: "删除成功", data: data })
        } else {
            res.send({ code: 0, mgs: "删除失败" })
        }
    })
});

//更新
router.post('/api/update', function(req, res, next) {
    var obj = req.body;
    var id = obj.id;

    delete obj.id;

    Mongo.update(batabaseName, collcationName, [{ "_id": id }, obj], function(data) {
        if (data) {
            res.send({ code: 1, mgs: "更改成功", data: data })
        } else {
            res.send({ code: 0, mgs: "更改失败" })
        }
    })
});

//分页(上拉加载)
router.post('/api/findPage', function(req, res, next) {
    var sortCunt;
    var page = req.body.page; //页数
    var pageSize = req.body.pageSize; //条数
    var sort = req.body.sortid; //排序

    if (sort == 1) {
        sortCunt = {
            idCard: 1
        }
    } else {
        sortCunt = {
            idCard: -1
        }
    }


    Mongo.find(batabaseName, collcationName, function(data) {
        if (data) {
            res.send({ code: 1, mgs: "查询成功", data: data })
        } else {
            res.send({ code: 0, mgs: "查询失败" })
        }
    }, {
        skip: (page - 1) * pageSize,
        limit: pageSize,
        sort: sortCunt
    })
});

module.exports = router;