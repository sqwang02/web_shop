<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="addProductAttrCate()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading"
                border>
        <el-table-column label="编号" width="50" align="center" :index="pageIndex " type="index"/>
        <!-- <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column> -->
        <el-table-column label="类型名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <!-- <el-table-column label="属性数量" width="200" align="center">
          <template slot-scope="scope">{{scope.row.attributeCount==null?0:scope.row.attributeCount}}</template>
        </el-table-column>
        <el-table-column label="参数数量" width="200" align="center">
          <template slot-scope="scope">{{scope.row.paramCount==null?0:scope.row.paramCount}}</template>
        </el-table-column> -->
        <el-table-column label="设置" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="getAttrList(scope.$index, scope.row)">属性列表
            </el-button>
            <!-- <el-button
              size="mini"
              @click="getParamList(scope.$index, scope.row)">参数列表
            </el-button> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
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
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="productAttrCatForm" :model="productAttrCate" :rules="rules" label-width="120px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="productAttrCate.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('productAttrCatForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList,createProductAttrCate,deleteProductAttrCate,updateProductAttrCate} from '@/api/productAttrCate'

  export default {
    name: 'productAttrCateList',
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5
        },
        dialogVisible: false,
        dialogTitle:'',
        productAttrCate:{
          name:'',
          id:null
        },
        rules: {
          name: [
            { required: true, message: '请输入类型名称', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList();
    },
    computed:{
      pageIndex() {
        return (this.listQuery.pageNum - 1) * this.listQuery.pageSize + 1
      }
    },
    methods: {
      //获取列表
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
          this.listQuery.pageNum=response.data.pageNum;
        });
      },
      //添加
      addProductAttrCate() {
        this.productAttrCate.name=null;
        this.dialogVisible = true;
        this.dialogTitle = "添加类型";
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      //表格中的删除按钮
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProductAttrCate(row.id).then(response=>{
            //response.data=1;
            this.$message({
              message: '删除成功',
              type: 'success',
              duration:1000
            });
            //console.log("successdelete"+this.listQuery.pageNum+this.listQuery.pageSize)
            this.getList();
          }).catch(err => {
              this.$message.error('删除失败hahah')
            })
        }).catch((err)=>{
          console.log(err)
        })
      },
      //表格中的编辑按钮
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.dialogTitle = "编辑类型";
        this.productAttrCate.name = row.name;
        this.productAttrCate.id = row.id;
      },
      //属性列表
      getAttrList(index, row) {
        this.$router.push({path: '/pms/productAttrList',query:{cid:row.id,cname:row.name,type:0}})
      },
      //参数列表
      // getParamList(index, row) {
      //   this.$router.push({path: '/pms/productAttrList',query:{cid:row.id,cname:row.name,type:1}})
      // },
      handleConfirm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //let data = new URLSearchParams();
            //data.append("name",this.productAttrCate.name);
            if(this.dialogTitle==="添加类型"){
              createProductAttrCate(this.productAttrCate).then(response=>{
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration:1000
                });
                //console.log(this.productAttrCate)
                this.dialogVisible = false;
                this.getList();
              });
            }else{
              // const productAttrCateStr=JSON.stringify(this.productAttrCate)
              // const name=JSON.stringify(this.productAttrCate.name)
              // const id=JSON.stringify(this.productAttrCate.id)
              // console.log(name)
              // console.log(id)
              // console.log(productAttrCateStr)
              // console.log(productAttrCateStr.id)
              updateProductAttrCate(this.productAttrCate).then(response=>{
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration:1000
                });
                this.dialogVisible = false;
                this.getList();
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>


