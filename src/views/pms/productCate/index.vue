<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProductCate()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productCateTable"
                style="width:100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="150" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="分类名称" width="250" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="级别" width="150" align="center">
          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
        </el-table-column>
        <el-table-column label="商品数量" width="150" align="center">
          <template slot-scope="scope">{{scope.row.number}}</template>
        </el-table-column>
        <el-table-column label="设置"  align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.id | disableNextLevel"
              @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
            </el-button>
            <el-button
              size="mini"
              @click="handleAddNextLevel(scope.$index,  scope.row)">添加下级
            </el-button>
            <el-button
              size="mini"
              @click="handleTransferProduct(scope.$index, scope.row)">转移商品
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination 
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes,prev, pager, next,jumper"
      :page-size="listQuery.pageSize"
      :current-page.sync="listQuery.pageNum"
      :page-sizes="[5,10,15]"
      :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="productCateForm" :model="productCate" :rules="rules" label-width="120px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="productCate.name"></el-input> 
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('productCateForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="dialog1Title"
      :visible.sync="dialog1Visible"
      width="40%">
      <el-form  :model="productTransfer"
              ref="productTransferForm"
              >
      <el-form-item label="请选择转移商品至目标分类:" prop="productCategoryId">
        <el-cascader
          clearable
          :props="productTransfer.defaultParams"
          v-model="productTransfer.selectedOptions"
          :options="productTransfer.productCateOptions"
          style="width:320px"
          ref="myCascader"
          >
        </el-cascader>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1Visible = false">取 消</el-button>
        <el-button type="primary" @click="handleTransfer('productTransferForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {fetchListWithChildren,fetchList,deleteProductCate,getAllProductCate,createProductCate,updateProductCate,transferProduct} from '@/api/productCate'
export default {
  name:"productCateList",
  data(){
    return{
      list:[],
      total:0,
      listLoading:true,
      listQuery:{
        pageNum:1,
        pageSize:5
      },
      parentId:0,
      dialogVisible:false,
      dialogTitle:'',
      dialog1Visible:false,
      dialog1Title:'',
      productCate:{
        name:'',
        parentId:null,
        id:null
      },
      rules:{
         name:[
            {required:true,message:'请输入分类名称',trigger:'blur'},
            {min:2,max:10,message:'长度在2到10个字符',trigger:'blur'}
        ]
      }, 
      productTransfer:{ 
      id:'',
      transId:null,
      productCateOptions:[],
      selectedOptions:[],
      defaultParams:{
          label:'name',
          value:'id',
          children:'children'
      },
      }
    }
  },
  created(){
    this.resetParentId();
    this.getList();
  },
  watch: {
    $route(route){
      this.resetParentId();
      this.getList();
    }
  },
  methods:{
    resetParentId(){
      this.listQuery.pageNum=1;
      if(this.$route.query.parentId!=null){
        this.parentId=this.$route.query.parentId;
      }else{
        this.parentId=0;
      }
    },
    getList(){
      this.listLoading = false;
      fetchList(this.parentId,this.listQuery).then(response => {
        this.listLoading = false; 
        var list1=[];
        var total1=0;
       
        for(let i=0;i<response.data.total;i++){  
         
            list1.push(response.data.list[i]);
            //total1++;
            //console.log(response.data.list.length);
          
        }
        // this.list=list1;
        // this.total=total1;
        this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
      }).catch((e)=>{});
    },
    handleSizeChange(val){
      this.listQuery.pageNum=1;
      this.listQuery.pageSize=val;
      this.getList();
    },
    handleCurrentChange(val){
      this.listQuery.pageNum=val;
      this.getList();
    },
    handleAddProductCate(){
      this.getNewProductCate();
      this.dialogVisible=true;
      this.dialogTitle="添加本级分类";
       if(this.$route.query.parentId!=null){
        this.productCate.parentId=this.$route.query.parentId;
      }else{
        this.productCate.parentId=0;
      }
      
    },
    handleAddNextLevel(index,row){
      this.getNewProductCate();
      this.dialogVisible=true;
      this.dialogTitle="添加下级分类";
      this.productCate.parentId=row.id;
    },
    handleShowNextLevel(index,row){
      this.$router.push({path:'/pms/productCate', query: {parentId: row.id}})
    },
    handleTransferProduct(index,row){ 
      this.getAllProductCate();
      this.dialog1Visible=true;
      this.dialog1Title="转移商品";
      this.productTransfer.id=row.id;
    },
    handleUpdate(index,row){
      this.getNewProductCate();
      this.dialogVisible=true;
      this.dialogTitle="编辑";
      this.productCate.name=row.name;
      this.productCate.parentId=row.parentId;
      this.productCate.id=row.id;
    },
    handleConfirm(formName){
      this.$refs[formName].validate((valid)=>{
        if(this.dialogTitle=="编辑"){
          updateProductCate(this.productCate).then(response=>{
            this.$message({
              message:'编辑成功',
              type:'success',
              duration:1000
            });
            this.dialogVisible=false;
            this.getList();
          });
        }else{
          createProductCate(this.productCate).then(response=>{
          this.$message({
            message:'创建成功',
            type:'success',
            duration:1000
          }); 
          this.dialogVisible=false;
          this.getList();
        });
         
        }      
      })
       
    },
    handleDelete(index,row){
      /*if(row.number>0){
        this.$message({
          message:'此分类中仍含有商品，无法删除',
          type:'warning'
        });
      }else{*/
        this.$confirm('是否需要删除该分类','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
        }).then(()=>{
          let params=new URLSearchParams();
          params.append("id",row.id);
        deleteProductCate(params).then(response=>{
          this.$message({
            message:'删除成功',
            type:'success',
            duration:1000
          });
          this.getList();
        });
      });
      },
      getNewProductCate(){
        this.productCate.name=null;
        this.productCate.id=null;
        this.productCate.parentId=null;
      },
      getAllProductCate(){
        getAllProductCate().then(response=>{
          this.productTransfer.productCateOptions=this.getTreeData(response.data)
        })
      },
      getTreeData(data){
        for(var i=0;i<data.length;i++){
          if(data[i].children.length<1){
            data[i].children=undefined;
          }else{
            this.getTreeData(data[i].children);
          }
        }
        return data;
      },
      handleTransfer(formName) {
          this.$refs[formName].validate((valid)=>{
            this.productTransfer.transId=this.$refs["myCascader"].currentValue;
            let params=new URLSearchParams();
            params.append("id",this.productTransfer.id);
            params.append("transId",this.productTransfer.transId);
            if(this.productTransfer.transId!=null){
              transferProduct(this.productTransfer.id,params).then((response)=>{
                this.$message({
                  message:'转移成功',
                  type:'success',
                  duration:1000
                });
              });
            }else{
              this.$message({
                message:'请选择目标分类',
                type:'warning'
              });
            }
            this.dialog1Visible=false;
            this.getList();
            });
        }
 

  //}
  },
  filters:{
    levelFilter(value){
      return value+'级';
    },
    disableNextLevel(value){
    }
  }
}
</script>
<style scoped>
</style>