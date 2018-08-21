<template>
    <div>
        <el-menu class="navbar" mode="horizontal">
            <!--左上角显示隐藏侧边栏-->
            <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
            <!--右上角个人图标-->
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                    <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu class="user-dropdown" slot="dropdown">
                    <router-link class='inlineBlock' to="/">
                        <el-dropdown-item>
                            首页
                        </el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided><span @click="logout" style="display:block;">LogOut</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <!--面包屑导航-->
            <el-breadcrumb class="app-levelbar" separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
                    <router-link v-if='item.redirect==="noredirect"||index==levelList.length-1' to=""
                                 class="no-redirect">
                        {{item.name}}
                    </router-link>
                    <router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </el-menu>


        <el-tabs type="card" v-model="activeTabName" closable @tab-remove="removeTab" @tab-click="clickTab">
            <el-tab-pane
                    v-for="(item, index) in tabs"
                    :key="item.path"
                    :label="item.name"
                    :name="item.path"
            >
            </el-tab-pane>

        </el-tabs>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Hamburger from '@/components/Hamburger'

    export default {
        data: {
            activeTabName: null
        },
        components: {
            Hamburger
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'avatar',
                'tabs'
            ])
        },
        created() {
            this.addTab()
            this.getBreadcrumb()
        },
        data() {
            return {
                levelList: null
            }
        },
        methods: {
            getBreadcrumb() {
                let matched = this.$route.matched.filter(item => item.name)
                const first = matched[0]
                if (first && (first.name !== '首页' || first.path !== '')) {
                    matched = [{name: '首页', path: '/'}].concat(matched)
                }
                this.levelList = matched
            },
            addTab() {
                let matched = this.$route.matched.filter(item => item.name)
                let lastMatch = matched[matched.length - 1]

                let exists = false
                let tabs = this.$store.getters.tabs
                tabs.forEach((tab, index) => {
                    if (tab.path === lastMatch.path) {
                        exists = true
                        return true;
                    }
                });
                if (!exists) {
                    this.$store.commit('ADD_TAB', lastMatch)
                }
                this.activeTabName = lastMatch.path
            },
            clickTab(tab) {
                this.$router.push({path: tab.name})
            },
            removeTab(path) {
                let tabs = this.$store.getters.tabs
                tabs.forEach((tab, index) => {
                    if (tab.path === path) {
                        // 移除Tab
                        this.$store.commit('REMOVE_TAB', path)

                        // 选中下一个Tab
                        let nextTab = tabs[index + 1] || tabs[index - 1]
                        if (nextTab) {
                            this.activeTabName = nextTab.name
                            this.clickTab({name: nextTab.path})
                        }
                    }
                    return false
                });
            },
            toggleSideBar() {
                this.$store.dispatch('ToggleSideBar')
            },
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    location.reload()  // 为了重新实例化vue-router对象 避免bug
                })
            }
        },
        watch: {
            $route() {
                this.addTab()
                this.getBreadcrumb()
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .app-levelbar.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 40px;
        margin-left: 10px;
        .no-redirect {
            color: #97a8be;
            cursor: text;
        }
    }

    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 150px;
        }
        .screenfull {
            position: absolute;
            right: 90px;
            top: 16px;
            color: red;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top: 5px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
</style>

