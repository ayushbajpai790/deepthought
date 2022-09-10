const express=require('express')
var ObjectId = require('mongodb').ObjectId; 
const {MongoClient}=require("mongodb")
const multer=require('multer')
const path=require('path')
app=express()
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage: storage,
    
})
const uri="mongodb://127.0.0.1:27017"
app.use(express.urlencoded({extended:true}))
const client=new MongoClient(uri)
const database=client.db("Event")
 const events=database.collection("events");
app.post("/api/v3/app/events", upload.single('profile'), (req, res) => {
    var db={
        e_name:req.body.name,
        image: `http://localhost:3000/profile/${req.file.filename}`,
      tline:req.body.tagline,
      Schedule:req.body.schedule,
      Description:req.body.description,
      moderator:req.body.moderator,
      Category:req.body.category,
      S_category:req.body.sub_category,
      r_rank:req.body.rigor_rank
   }
   var p;
   async function lw(){
       
  
  p= await events.insertOne(db);
  res.send(p.insertedId);
  await client.close();

   }
   lw()
  
})
app.get("/api/v3/app/events",(req,res)=>{
if(req.query.id!=null){
async function p(){
   const e_id =req.query.id;
const r=new ObjectId(e_id);
const t=await events.findOne({_id:r});
console.log(t);
res.send(t);}
p()
}else{
    if(req.query.type=="latest")
    {
        const limits=parseInt(req.query.limit);
        const page=req.query.page;
     const result= events.find({}).sort({_id:-1}).limit(limits).toArray(function(err,result){
    
        if (err) throw err;
       const t= result.slice(limits * (page - 1),limits * page);
        res.send(t);
     })
    
   
}
}
})
app.put("/api/v3/app/events/:id",upload.single('profile'),async(req,res)=>{
    const e_id=req.params.id;
    const r=new ObjectId(e_id);
   const y=await events.findOneAndUpdate({ _id: r }, {
       $set: {
           e_name: req.query.name,
           image: `http://localhost:4000/profile/${req.query.filename}`,
           tline: req.query.tagline,
           Schedule: req.query.schedule,
           Description: req.query.description,
           moderator: req.query.moderator,
           Category: req.query.category,
           S_category: req.query.sub_category,
           r_rank: req.query.rigor_rank
       }
   }, { returnOriginal: false, upsert: false})
    res.send(y);
})
app.delete("/api/v3/app/events/:id",async(req,res)=>{
    const e_id=req.params.id;
    const r=new ObjectId(e_id);
   const t= await events.deleteOne({_id:r})
   res.send(t);

})
    
app.listen(3000)