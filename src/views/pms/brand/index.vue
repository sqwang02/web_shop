<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            style="float: right"
            @click="searchBrandList()"
            type="primary"
            size="small">
            查询结果
          </el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
            <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="listQuery.name" placeholder="品牌名称/关键字"></el-input>
            </el-form-item>
          </el-form>
        </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="addBrand('productBrandForm')"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="brandTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center" :index="pageIndex " type="index"/>
        <el-table-column label="品牌名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
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
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
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
      <el-form ref="productBrandForm" :model="productBrand" :rules="rules" label-width="120px">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="productBrand.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('productBrandForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList, createProductBrand,updateProductBrand, deleteBrand,fetchGetList} from '@/api/brand'

  export default {
    name: 'brandList',
    data() {
      return {
        operates: [
          {
            label: "删除品牌",
            value: "deleteBrand"
          },
        ],
        dialogVisible: false,
        dialogTitle:'',
        productBrand:{
          name:'',
          id:null,
          delete_status:0
        },
        rules: {
          name: [
            { required: true, message: '请输入类型名称', trigger: 'blur' }
          ]
        },
        operateType: null,
        listQuery: {
          name: null,
          pageNum: 1,
          pageSize: 10
        },
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: []
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
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
      },
      searchGetList(){
        this.listLoading = true;
        fetchGetList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
           this.total = response.data.total;
           this.totalPage = response.data.totalPage;
           this.pageSize = response.data.pageSize;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //表格中的编辑按钮
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.dialogTitle = "编辑品牌";
        this.productBrand.id = row.id;
        this.productBrand.name = row.name;
      },
      handleConfirm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.dialogTitle==="添加品牌"){
              
              createProductBrand(this.productBrand).then(response=>{
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration:1000
                });
                this.$refs[formName].resetFields();
                this.dialogVisible = false;
                this.getList();
              });
            }else{
              updateProductBrand(this.productBrand).then(response=>{
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration:1000
                });
                this.$refs[formName].resetFields();
                this.dialogVisible = false;
                this.getList();
              })
            }
          } else {
            this.$refs[formName].resetFields();
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params=new URLSearchParams();
          params.append("id",row.id);
          deleteBrand(params).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          }).catch((err)=>{
            console.log(err)
          });
        }).catch((err)=>{
            console.log(err)
        })
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
      searchBrandList() {
        this.listQuery.pageNum = 1;
        this.searchGetList();
      },
      handleBatchOperate() {
        console.log(this.multipleSelection);
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let showStatus = 0;
        if (this.operateType === 'deleteBrand') {
          showStatus = 1;
        } else if (this.operateType === 'hideBrand') {
          showStatus = 0;
        } else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          let params=new URLSearchParams();
          params.append("id",this.multipleSelection[i].id);
          deleteBrand(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
          this.getList();

        });
        }
        ta.append("showStatus", showStatus);
      },
      addBrand() {
        this.productBrand.name = null;
        this.dialogVisible = true;
        this.dialogTitle = "添加品牌";
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>


</style>


