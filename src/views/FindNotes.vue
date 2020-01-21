<template>
    <div>
        <div class="block">
            <el-timeline>
                <el-timeline-item class="container" v-for='(item,index) in data' :key='index'
                    :timestamp="item.date.slice(0,10)" placement="top">
                    <div class="left">
                        <el-card>
                            <h4>{{item.content}}</h4>
                            <p>{{item.name}} —— {{item.date.slice(0,10)}} </p>
                        </el-card>
                    </div>
                    <div class="right">
                        <el-button class="btn" type="danger" icon='delete' @click='onDeleteNote(item._id)'>删除
                        </el-button>
                    </div>
                </el-timeline-item>
            </el-timeline>
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="paginations.page_index"
                :page-size="paginations.page_size" layout="total, prev, pager, next" :total="paginations.total">
            </el-pagination>
        </div>
    </div>
</template>


<script>
    export default {
        name: 'findNotes',
        data() {
            return {
                data: [],
                allData: [],
                paginations: {
                    page_index: 1,
                    page_size: 3,
                    total: 0,
                },

            }
        },
        created() {
            this.getNotes()
        },
        methods: {
            getNotes() {
                this.$axios.get('/api/notes/findAll')
                    .then(res => {
                        this.data = res.data
                        this.allData = res.data
                        this.setPaginations()
                    })
            },
            setPaginations() {
                this.paginations.total = this.data.length
                this.data = this.allData.filter((item, index) => {
                    return index < this.paginations.page_size
                })
            },
            handleCurrentChange(page) {
                let sortnum = this.paginations.page_size * (page - 1)
                let table = this.allData.filter((item, index) => {
                    return index >= sortnum
                })
                this.data = table.filter((item, index) => {
                    return index < this.paginations.page_size
                })
            },
            onDeleteNote(id) {
                this.$axios.delete(`/api/notes/delete/${id}`)
                    .then(res => {
                        this.$message('删除成功')
                        this.getNotes()
                    })
            }
        }
    }
</script>

<style scoped>
    .block {
        width: 600px;
        margin: 50px auto;
    }

    .block h4 {
        font-size: 14px;
    }

    .block p {
        font-size: 8px;
        color: #ccc;
        margin-top: 30px;
    }

    .pagination {
        position: absolute;
        bottom: 20px;
        right: 20px;
    }

    el-timeline {
        width: 100%;
    }

    .container {
        width: 100%;
        height: 130px;
    }

    .left {
        width: 508px;
        float: left;
    }

    .right {
        width: 60px;
        float: right;
        height: 97px;
    }

    .right .btn {
        width: 100%;
        height: 100%;
        text-align: center;
    }
</style>