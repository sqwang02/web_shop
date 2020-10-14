<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="80" align="center" :index="pageIndex " type="index"/>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="商品名称"  align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
            <p>品牌：{{scope.row.brandName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.price}}</p>
            <p>货号：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>上架：
              <el-switch
                @change="handlePublishStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.publishStatus">
              </el-switch>
            </p>
            <p>推荐：
              <el-switch
                @change="handleRecommendStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.recommendStatus">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                @click="handleUpdatePrice(scope.$index, scope.row)">修改价格
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                @click="handleShowLog(scope.$index, scope.row)">日志
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
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
      <el-form ref="productPriceForm" :model="productPrice" :rules="rules" label-width="120px">
        <el-form-item label="价格" prop="price">
          <el-input v-model="productPrice.price" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="handlePriceConfirm('productPriceForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  nextFetchList,
  updateNextDeleteStatus,
  updateNextRecommendStatus,
  updateNextPublishStatus,
  updatePublishStatus,
  updatePrice
} from '@/api/product'
import {fetchList as fetchSkuStockList,update as updateSkuStockList} from '@/api/skuStock'
import {fetchList as fetchProductAttrList} from '@/api/productAttr'
import {fetchList as fetchBrandList} from '@/api/brand'
//import {fetchListWithChildren} from '@/api/productCate'

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null
};
export default {
  name: "productList",
  data() {
    return {
      operates: [
        {
          label: "商品上架",
          value: "publishOn"
        },
        {
          label: "商品下架",
          value: "publishOff"
        },
        {
          label: "设为推荐",
          value: "recommendOn"
        },
        {
          label: "取消推荐",
          value: "recommendOff"
        },

        {
          label: "转移到分类",
          value: "transferCategory"
        },
        {
          label: "移入回收站",
          value: "recycle"
        }
      ],
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      multipleSelection: [],
      productCateOptions: [],
      brandOptions: [],
      publishStatusOptions: [{
        value: 1,
        label: '上架'
      }, {
        value: 0,
        label: '下架'
      }],
       dialogVisible: false,
        dialogTitle:'',
        productPrice:{
          price:null,
          id:null
        },
        rules: {
          name: [
            { required: true, message: '请输入价格', trigger: 'blur' }
          ]
        }
    }
  },
  
  created() {
    this.getNextList();
    //this.getBrandList();
    this.getProductCateList();
  },
  computed:{
      pageIndex() {
        return (this.listQuery.pageNum - 1) * this.listQuery.pageSize + 1
      }
    },
  watch: {
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }

    }
  },

  methods: {
    getNextList() {
      this.listLoading = true;
      nextFetchList(this.$route.query.sid).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    getBrandList() {
      fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
        }
      });
    },
    getProductCateList() {
      fetchListWithChildren().then(response => {
        let list = response.data;
        this.productCateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({label: list[i].children[j].name, value: list[i].children[j].id});
            }
          }
          this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
        }
      });
    },
  
    handleSearchEditSku(){
      fetchSkuStockList(this.editSkuInfo.productId,{keyword:this.editSkuInfo.keyword}).then(response=>{
        this.editSkuInfo.stockList=response.data;
      });
    },
    handlePriceConfirm(formName){
     this.$refs[formName].validate((valid) => {

          if (valid) {
            let data = new URLSearchParams();
             data.append("price",this.productPrice.price);
              updatePrice(this.productPrice.id,data).then(response=>{
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration:1000
                });
                this.dialogVisible = false;
                this.getNextList();
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getNextList();
    },
    handleAddProduct() {
      this.$router.push({path:'/pms/addProduct'});
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getNextList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getNextList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handlePublishStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateNextPublishStatus(ids,row.publishStatus);
    },
    handleRecommendStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateNextRecommendStatus(ids,row.recommendStatus);
    },
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleDelete(index, row){
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id);
          this.updateDeleteStatus(ids);
        });
      },

    updateDeleteStatus(ids) {
        updateNextDeleteStatus(ids).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
        });
        this.getNextList();
      },


    handleShowLog(index,row){
      this.$router.push({path:'/pms/showPriceLog',query:{pid:row.id}});
    },
    handleUpdateProduct(index,row){
      this.$router.push({path:'/pms/updateProduct',query:{id:row.id}});
    },
    handleUpdatePrice(index,row){   
        this.dialogVisible = true;
        this.dialogTitle = "修改价格";
        this.productPrice.price= row.price;
        this.productPrice.id = row.id;
    },
     updateNextRecommendStatus(ids,recommendStatus) {
      let params = new URLSearchParams();
      params.append('ids', ids);
      params.append('status', recommendStatus);
      updateNextRecommendStatus(ids,params).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
    },
    updateNextPublishStatus(ids,publishStatus) {
      let params = new URLSearchParams();
      params.append('ids', ids);
      params.append('status', publishStatus);
      updateNextPublishStatus(ids,params).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
      this.getNextList();
      console.log(this.list.length) 
      //遍历   如果商品全为下架状态，一级列表对应的商品下架
       let flag = 1;
       for (let i = 0; i < this.list.length; i++) {
         if(this.list[i].publishStatus==1){
           flag = 0;
           break;
         }
        }
        if (flag == 1){         
          let id = this.$route.query.sid; //对应的上级商品sid   =>  this.$route.query.sid
          let params = new URLSearchParams();
           params.append('id', id);
           params.append('status', 0);
            updatePublishStatus(id,params).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              });
            });
        }
    }
  }
}
</script>
<style></style>


