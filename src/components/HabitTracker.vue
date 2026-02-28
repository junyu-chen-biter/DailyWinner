<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'

interface Task {
  id: number
  name: string
  lastCheckDate: string
  streak: number
  isCompletedToday: boolean
}

const tasks = ref<Task[]>([])
const newHabitName = ref('')
const isAutoLaunchEnabled = ref(false)
const isBrowserEnv = ref(false)

const themeStatus = computed(() => {
  if (tasks.value.length === 0) return 'default'
  
  const threeDaysAgo = dayjs().subtract(3, 'day')
  const hasOverdue = tasks.value.some(task => {
    if (!task.lastCheckDate) return false
    return dayjs(task.lastCheckDate).isBefore(threeDaysAgo, 'day')
  })

  if (hasOverdue) return 'warning'

  const allCompleted = tasks.value.every(task => task.isCompletedToday)
  if (allCompleted) return 'success'

  return 'default'
})

const addHabit = () => {
  if (!newHabitName.value.trim()) return
  
  const newTask: Task = {
    id: Date.now(),
    name: newHabitName.value.trim(),
    lastCheckDate: "",
    streak: 0,
    isCompletedToday: false
  }
  
  tasks.value.push(newTask)
  newHabitName.value = ''
  
  if (window.electronAPI) {
    window.electronAPI.updateTasks(JSON.parse(JSON.stringify(tasks.value)))
  }
}

const deleteHabit = (id: number) => {
  tasks.value = tasks.value.filter(t => t.id !== id)
  
  if (window.electronAPI) {
    window.electronAPI.updateTasks(JSON.parse(JSON.stringify(tasks.value)))
  }
}

const loadTasks = async () => {
  try {
    if (!window.electronAPI) {
      console.warn('electronAPI not found - Running in Browser Mode')
      isBrowserEnv.value = true
      tasks.value = [
        { id: 1, name: "背单词 (Mock)", lastCheckDate: "", streak: 5, isCompletedToday: false },
        { id: 2, name: "健身 (Mock)", lastCheckDate: dayjs().format('YYYY-MM-DD'), streak: 12, isCompletedToday: true },
        { id: 3, name: "早起 (Mock)", lastCheckDate: "", streak: 0, isCompletedToday: false },
      ]
      return
    }
    const storedTasks: Task[] = await window.electronAPI.getTasks()
    
    if (!storedTasks || storedTasks.length === 0) {
      tasks.value = [
        { id: 1, name: "背单词", lastCheckDate: "", streak: 0, isCompletedToday: false },
        { id: 2, name: "健身", lastCheckDate: "", streak: 0, isCompletedToday: false },
      ]
      window.electronAPI.updateTasks(JSON.parse(JSON.stringify(tasks.value)))
    } else {
      const today = dayjs().format('YYYY-MM-DD')
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

      tasks.value = storedTasks.map(task => {
        if (task.lastCheckDate === today) {
          task.isCompletedToday = true
        } else {
          task.isCompletedToday = false
          if (task.lastCheckDate !== yesterday && task.lastCheckDate !== today) {
            task.streak = 0
          }
        }
        return task
      })
    }
  } catch (error) {
    console.error('Failed to load tasks:', error)
  }
}

const checkIn = (task: Task) => {
  if (task.isCompletedToday) return

  const today = dayjs().format('YYYY-MM-DD')
  
  task.lastCheckDate = today
  task.streak += 1
  task.isCompletedToday = true
  
  if (window.electronAPI) {
    window.electronAPI.updateTasks(JSON.parse(JSON.stringify(tasks.value)))
  }
}

const toggleAutoLaunch = async () => {
  if (!window.electronAPI) return
  isAutoLaunchEnabled.value = !isAutoLaunchEnabled.value
  window.electronAPI.toggleAutoLaunch(isAutoLaunchEnabled.value)
}

onMounted(async () => {
  loadTasks()
  if (window.electronAPI) {
    isAutoLaunchEnabled.value = await window.electronAPI.getAutoLaunchStatus()
  }
})
</script>

<template>
  <div class="habit-wrapper" :class="themeStatus">
    <!-- 顶部拖拽栏 + 标题 -->
    <div class="header">
      <div class="app-title">Daily Habit</div>
      <div class="drag-handle"></div>
    </div>

    <!-- 任务列表 -->
    <div class="habit-container">
      <div v-for="task in tasks" :key="task.id" class="habit-item">
        <div class="habit-info">
          <div class="habit-name">{{ task.name }}</div>
          <div class="habit-streak">
            <span class="streak-icon">🔥</span> 
            <span class="streak-count">{{ task.streak }}</span> 
            <span class="streak-label">days</span>
          </div>
        </div>
        <div class="habit-actions">
          <button 
            class="check-btn" 
            :class="{ completed: task.isCompletedToday }" 
            @click="checkIn(task)"
            :disabled="task.isCompletedToday"
          >
            <span v-if="task.isCompletedToday">✓</span>
            <span v-else>Done</span>
          </button>
          <button class="delete-btn" @click="deleteHabit(task.id)" title="Delete Habit">
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- 添加习惯输入栏 -->
    <div class="add-habit-bar">
      <input 
        v-model="newHabitName" 
        @keyup.enter="addHabit"
        type="text" 
        placeholder="Add new habit..." 
      />
      <button @click="addHabit" :disabled="!newHabitName.trim()">
        +
      </button>
    </div>

    <!-- 底部控制栏 -->
    <div class="footer-controls">
      <div v-if="isBrowserEnv" class="env-badge">Browser Mode</div>
      <label class="auto-launch-toggle" title="Run on startup">
        <input type="checkbox" :checked="isAutoLaunchEnabled" @change="toggleAutoLaunch">
        <span>Auto-start</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
/* 主容器：模拟完整的卡片 */
.habit-wrapper {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  background: #ffffff; /* 纯白背景，显高级 */
  border: 1px solid #e0e0e0; /* 完整的边框 */
  border-radius: 12px; /* 圆角 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12); /* 更柔和的高级阴影 */
  transition: all 0.5s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* 状态颜色：仅改变边框或轻微背景，保持高级感 */
.habit-wrapper.success {
  border-color: #4caf50;
  background: #fdfdfd;
}
.habit-wrapper.warning {
  border-color: #ff5252;
  background: #fffafa;
}

/* 顶部栏 */
.header {
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
  flex-shrink: 0;
  position: relative;
}

.app-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  letter-spacing: -0.5px;
  z-index: 2; /* 确保文字在拖拽层之上（如果需要点击）- 但这里拖拽层是兄弟元素 */
  pointer-events: none; /* 让鼠标穿透到下方的 drag-handle (如果有重叠)，或者直接让 header 可拖拽 */
}

.drag-handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-app-region: drag; /* 整个 header 可拖拽 */
  z-index: 1;
}

/* 内容区域 */
.habit-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
  overflow-y: auto;
  background: #fff;
}

.habit-container::-webkit-scrollbar {
  width: 4px;
}
.habit-container::-webkit-scrollbar-thumb {
  background: #eee;
  border-radius: 2px;
}

/* 任务卡片 */
.habit-item {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.habit-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-color: #e0e0e0;
}

.habit-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.habit-name {
  font-weight: 600;
  font-size: 15px;
  color: #2c3e50;
}

.habit-streak {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
}

.streak-count {
  font-weight: bold;
  color: #ff9800;
}

.habit-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 按钮样式 */
.check-btn {
  background: #f0f2f5;
  color: #666;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 64px;
  display: flex;
  justify-content: center;
}

.check-btn:hover:not(:disabled) {
  background: #e1e4e8;
  color: #333;
}

.check-btn.completed {
  background: #e8f5e9;
  color: #4caf50;
  cursor: default;
}

.check-btn:disabled {
  opacity: 0.8;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #ccc;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  line-height: 1;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #ffebee;
  color: #ff5252;
}

/* 添加习惯栏 */
.add-habit-bar {
  padding: 12px 16px;
  background: #f8f9fa;
  border-top: 1px solid #eaeaea;
  display: flex;
  gap: 8px;
}

.add-habit-bar input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}

.add-habit-bar input:focus {
  border-color: #333;
}

.add-habit-bar button {
  width: 36px;
  height: 36px;
  border: none;
  background: #333;
  color: #fff;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.add-habit-bar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-habit-bar button:hover:not(:disabled) {
  opacity: 0.9;
}

/* 底部栏 */
.footer-controls {
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
  background: #f8f9fa;
  border-top: 1px solid #eaeaea;
}

.auto-launch-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  margin-left: auto;
}

.auto-launch-toggle input {
  accent-color: #333;
}

.env-badge {
  background: #ffebee;
  color: #c62828;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
}
</style>
