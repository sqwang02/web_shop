<template>
  <div class="table-container">
    <el-table ref="productTable"
              :data="list"
              style="width: 100%"
              border>
      <el-table-column label="商品ID" align="center">
        <template slot-scope="scope">{{scope.row.pId}}</template>
      </el-table-column>
      <el-table-column label="起始日期"  align="center">
        <template slot-scope="scope">{{scope.row.beginTime}}</template>
      </el-table-column>
      <el-table-column label="结束日期"  align="center">
        <template slot-scope="scope">{{scope.row.endTime}}</template>
      </el-table-column>
      <el-table-column label="价格"  align="center">
        <template slot-scope="scope">{{scope.row.price}}</template>
      </el-table-column>
      <el-table-column label="状态"  align="center">
        <template slot-scope="scope">{{scope.row.overStatus}}</template>
      </el-table-column>
    </el-table>
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
  </div>
</template>

<script>
import {getPriceLog} from '@/api/product'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
};

export default {
  name: "priceLog",
  data(){
    return{
      listQuery: Object.assign({}, defaultListQuery),
      total:null,
      list:null
    }
  },
  created(){
    this.getList()
  },
  methods:{
    
     handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      getList(){
      getPriceLog(this.$route.query.pid,this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.pageNum = response.pageNum;
        this.pageSize = response.pageSize;
      })
    }
  }
}
</script>

<style scoped>

</style>
