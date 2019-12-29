<template>
    <div class="fillcontain">
        <div>
            <el-form :inline="true" ref="search_data" :model="search_data">
                <el-form-item label="日期筛选">
                    <el-date-picker v-model="search_data.start_time" type="datetime" placeholder="选择开始时间">
                    </el-date-picker>
                    --
                    <el-date-picker v-model="search_data.end_time" type="datetime" placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click='onScreeoutMoney()'>筛选</el-button>
                </el-form-item>
                <el-form-item class="btnRight">
                    <el-button v-if="user.identity == 'manager'" type="primary" size="small" icon="view"
                        @click="onAddMoney()">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table v-if="tableData.length > 0" :data="tableData" style="width: 100%" max-height="420" border
                :default-sort="{prop: 'date', order: 'ascending'}">
                <el-table-column type="index" label="序号" align='center' width="45">
                </el-table-column>
                <el-table-column prop="date" label="创建时间" align='center' width="125" sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px">{{ scope.row.date | dataFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type1 type2" label="收支类型" align='center' width="240">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type1 }}/{{scope.row.type2}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="describe" label="收支描述" align='center' width="110">
                </el-table-column>
                <el-table-column prop="income" label="收入" align='center' width="100">
                    <template slot-scope="scope">
                        <span style="color:#00d053">+ {{ scope.row.income }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="expend" label="支出" align='center' width="100">
                    <template slot-scope="scope">
                        <span style="color:#f56767">- {{ scope.row.expend }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="cash" label="盈损情况" align='center' width="110">
                    <template slot-scope="scope">
                        <span style="color:#4db3ff" v-if="scope.row.cash>0">盈利{{ scope.row.cash }}</span>
                        <span style="color:#4db3ff" v-if="scope.row.cash<0">亏损{{ -scope.row.cash}}</span>
                        <span style="color:#4db3ff" v-if="scope.row.cash==0">盈损持平</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align='center' width="110">
                </el-table-column>
                <el-table-column label="操作" prop="operation" align='center' fixed="right" width="160">
                    <template v-if="user.identity==='manager'" slot-scope="scope">
                        <el-button type="warning" icon='edit' size="small" @click='onEditMoney(scope.row)'>编辑
                        </el-button>
                        <el-button type="danger" icon='delete' size="small"
                            @click='onDeleteMoney(scope.row,scope.$index)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
                <el-pagination v-if='paginations.total > 0' @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="paginations.page_index"
                    :page-sizes="paginations.page_sizes" :page-size="paginations.page_size" :layout="paginations.layout"
                    :total="paginations.total">
                </el-pagination>
            </div>
        </div>
        <!--添加按钮弹框-->
        <DialogFound :dialog="dialog" :form="form" @update="getProfile"></DialogFound>
    </div>
</template>

<script>
    import DialogFound from '../components/DialogFound'
    export default {
        name: 'foundlist',
        data() {
            return {
                tableData: [],
                allTableData: [],
                filterTableData: [],
                dialog: {
                    show: false,
                    title: "",
                    option: "edit"
                },
                form: {
                    type1: "",
                    type2: "",
                    describe: "",
                    income: "",
                    expend: "",
                    cash: "",
                    remark: "",
                    id: ""
                },
                paginations: {
                    page_index: 1,//当前位于那一页
                    total: 0,//总数
                    page_size: 5,//初始一页显示5条
                    page_sizes: [5, 10, 15, 20],//每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"//翻页属性
                },
                search_data: {
                    start_time: '',
                    end_time: ''
                }
            }
        },
        created() {
            this.getProfile()
        },
        computed: {
            user() {
                return this.$store.getters.user;
            }
        },
        methods: {
            getProfile() {
                //获取数据
                this.$axios.get('/api/profiles/findAll')
                    .then(res => {
                        this.tableData = res.data
                        this.allTableData = res.data
                        this.filterTableData = res.data
                        // 设置分页数据
                        this.setPaginations()
                    })
            },
            onEditMoney(row) {
                //编辑
                //row拿到的是scope.row 每一行的数据
                this.dialog = {
                    show: true,
                    title: "修改资金信息",
                    option: "edit"
                }
                this.form = {
                    type1: row.type1,
                    type2: row.type2,
                    describe: row.describe,
                    income: row.income,
                    expend: row.expend,
                    cash: row.cash,
                    remark: row.remark,
                    id: row._id
                }
            },
            onDeleteMoney(row, index) {
                //删除
                this.$axios.delete(`/api/profiles/delete${row._id}`)
                    .then(res => {
                        this.$message('删除成功')
                        this.getProfile()
                    })
            },
            onAddMoney() {
                // 添加
                this.dialog = {
                    show: true,
                    title: "添加资金信息",
                    option: "add"
                }
                this.form = {
                    type1: "",
                    type2: "",
                    describe: "",
                    income: "",
                    expend: "",
                    cash: "",
                    remark: "",
                    id: ""
                }
            },
            handleSizeChange(page_size) {
                //切换size    page_size为每页的大小(多少条数据)
                this.paginations.page_index = 1
                this.paginations.page_size = page_size
                //重新筛选数组中索引小于page_size的项
                //数组的filter方法，filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
                //方法有三个参数，第一个必须为每一项，第二个和第三个可选，分别为索引值和当前元素属于的数组对象
                this.tableData = this.allTableData.filter((item, index) => {
                    return index < page_size;
                })
            },
            handleCurrentChange(page) {
                //page为当前页  sortnum为当前页之前所有页面的所有数据,table为筛选后的数据
                let sortnum = this.paginations.page_size * (page - 1)
                //table为去掉了page页之前所有页的数据后，剩下的数据
                let table = this.allTableData.filter((item, index) => {
                    return index >= sortnum
                })
                //在剩下的数据中又筛选当前页
                this.tableData = table.filter((item, index) => {
                    return index < this.paginations.page_size;
                })
            },
            setPaginations() {
                //总数
                this.paginations.total = this.allTableData.length
                //设置page_index
                this.paginations.page_index = 1
                //设置page_size
                this.paginations.page_size = 5
                //筛选出数组中索引小于page_size的项
                this.tableData = this.allTableData.filter((item, index) => {
                    return index < this.paginations.page_size
                })
            },
            onScreeoutMoney() {
                //筛选
                if (!this.search_data.start_time || !this.search_data.end_time) {
                    this.$message({
                        type: "warning",
                        message: "请选择时间区间"
                    });
                    this.getProfile()
                    return
                }
                const stime = this.search_data.start_time.getTime()
                const etime = this.search_data.end_time.getTime()
                this.allTableData = this.filterTableData.filter(item => {
                    let date = new Date(item.date)
                    let time = date.getTime()
                    return time >= stime && time <= etime
                });
                // 分页数据
                this.setPaginations()
            }
        },
        components: {
            DialogFound
        }
    }
</script>

<style scoped>
    .fillcontain {
        width: 100%;
        height: 100%;
        padding: 16px;
        box-sizing: border-box;
    }

    .btnRight {
        float: right;
    }

    .pagination {
        text-align: right;
        margin-top: 10px;
    }
</style>