<template>
    <div class="user-wrapper">
        <span class="action"><a-icon type="search" class="action" @click="searchMenuVisible=true"/></span>
        <!-- <component 
            :is="searchMenuComp" 
            title="搜索菜单" 
            :footer="null" 
            v-show="searchMenuVisible" 
            @cancel="searchMenuVisible=false"
        >
            <a-select
                class="search-input"
                showSearch
                :showArrow="false"
                placeholder="搜索菜单"
                optionFilterProp="children"
                :filterOption="filterOption"
            >
                <a-select-option v-for="route in routes" :key="route.path">
                    
                </a-select-option>
            </a-select>
        </component> -->
        <span class="question">
            <a-icon type="question-circle-o" class="action"></a-icon>
        </span>
        <header-notice />
        <a-dropdown placement="bottomCenter">
            <span class="action-full ant-dropdown-link user-dropdown-menu">
                <a-avatar class="avatar" :src="user.avatar" />
                <span>欢迎您,{{user.name}}用户</span>
            </span>
            <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item key="0">
          <router-link to="">
            <a-icon type="user"/>
            <span>个人中心</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="1">
          <router-link to="">
            <a-icon type="setting"/>
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
           <a-icon type="tool"/>
           <span>系统设置</span>
        </a-menu-item>
        <a-menu-item key="4">
          <a-icon type="setting"/>
          <span>密码修改</span>
        </a-menu-item>
        <a-menu-item key="5">
          <a-icon type="cluster"/>
          <span>切换部门</span>
        </a-menu-item>
        <a-menu-item key="6">
          <a-icon type="sync"/>
          <span>清理缓存</span>
        </a-menu-item>
      </a-menu>
      </a-dropdown>
      <span class="logout" @click="handleLogout">
        <a class="logout_title">
            <a-icon type="logout"/>
            <span>&nbsp;退出登录</span>
        </a>
      </span>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import HeaderNotice from './HeaderNotice'
    export default {
        name: "UserMenu",
        components: {
            HeaderNotice,
        },
        data() {
            return {
                searchMenuComp: 'span',
                searchMenuVisible: false
            }
        },
        created() {
            console.log(this.routes)
        },
        computed: {
            ...mapState(['user']),
            ...mapGetters(['routers']),
            routes() {
                return this.routers.filter(item => !item.hidden && item.children);
            }
        },
        methods: {
            ...mapActions(['Logout']),
            filterOption(inputValue, option) {
                console.log(inputValue, option)
            },
            handleLogout() {
                let that = this;
                this.$confirm({
                    title: '提示',
                    content: '确定退出登录吗?',
                    async onOk(){
                        try {
                            console.log(this)
                            await that.Logout();
                            that.$router.push({path: '/login'})
                        } catch (error) {
                            that.$message.error(error.message)
                        }
                    },
                    onCancel() {},
                });
            }
        },
    }
</script>

<style lang="less" scoped>
.user-wrapper {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    margin-right: 10px;
    .search-input {
        width: 180px;
        color: inherit;
    }
    /deep/ .ant-select-selection {
      background-color: inherit;
      border: 0;
      border-bottom: 1px solid white;
      &__placeholder, &__field__placeholder {
        color: inherit;
      }
    }
    .question {
        color: inherit;
        text-decoration: none;
    }
    .action {
        margin: 0 10px;
        cursor: pointer;
        &:hover {
            color:#f1f1f1;
        }
    }
    .action-full {
        cursor: pointer;
        padding: 0 10px;
        &:hover {
            background-color: rgba(243, 243, 243, .2);
        }
        .avatar {
            margin-right: 10px;
        }
    }
    .logout {
        padding: 0 10px;
        &:hover {
            cursor: pointer;
            background-color: rgba(243, 243, 243, .2);
            }
        }
    .logout_title {
        color: inherit;
        text-decoration: none;
  }
} 
</style>