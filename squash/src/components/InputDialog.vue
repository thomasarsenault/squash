<script setup lang="ts">
import { watch, computed, onMounted, onBeforeUnmount, ref } from 'vue';

const props = defineProps({
  header: {
    type: String,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
  },
  icon: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['update:visible']);

const isVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  },
});

const dialogRef = ref(null);

const closeDialog = () => {
  isVisible.value = false;
};

// prevent background scrolling
const preventScroll = () => {
  if (isVisible.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

watch(isVisible, () => {
  preventScroll();
});

const onKeyDown = (e: any) => {
  if (e.key === 'Escape' && isVisible.value) {
    closeDialog();
  }
};

onMounted(() => {
  document.addEventListener('keydown', onKeyDown);
  preventScroll();
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="isVisible" class="dialog-overlay" @click.self="closeDialog" :id="props.id">
        <!-- TODO: this transition doesn't work because of the nested v-if directives, so right now it only fades -->
        <Transition name="dialog-scale">
          <div class="dialog-container" v-if="isVisible" ref="dialogRef">
            <div class="dialog-header">
              <h3><i v-if="icon" :class="`pi pi-${icon}`" /> {{ header }}</h3>
              <button class="dialog-close" @click="closeDialog">&times;</button>
            </div>
            <div class="dialog-content">
              <slot />
            </div>
            <div class="dialog-footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-container {
  background-color: var(--p-card-background);
  border-radius: var(--p-overlay-modal-border-radius);
  width: 500px;
  max-width: 90%;
  box-shadow: var(--p-overlay-modal-shadow);
}

/* Header Styles */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.dialog-header h3 {
  margin: 0;
  font-weight: bold;

  i {
    margin-right: 0.5rem;
  }
}

.dialog-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.dialog-content {
  padding: var(--p-overlay-modal-padding);
  padding-top: 0;
}

.dialog-footer {
  padding: var(--p-overlay-modal-padding);
  padding-top: 0;
  text-align: right;
}

/* fade transition */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.overlay-fade-enter-to,
.overlay-fade-leave-from {
  opacity: 1;
}

/* scale transition (doesn't work rn) */
.dialog-scale-enter-active,
.dialog-scale-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.dialog-scale-enter-from,
.dialog-scale-leave-to {
  transform: scale(0.5);
  opacity: 0;
}

.dialog-scale-enter-to,
.dialog-scale-leave-from {
  transform: scale(1);
  opacity: 1;
}
</style>
