function defineAsyncComponent(options) {
  if (typeof options === 'function') {
    options = {
      loader: options,
    }
  }
  let InnerComp = null;
  return {
    name: 'AsyncComponentWrapper',
    setup() {
      const loaded = ref(false);
      const timeout = ref(false); // 代表是否超时

      loader.then(c => {
        InnerComp = c;
        loaded.value = true;
      })

      let timer = null;
      if (options.timeout) {
        timer = setTimeout(() => {
          timeout.value = true;
        }, options.timeout)
      }
      onUnmounted(() => clearTimeout(timer));
      const placeholder = {type: Text, children: ''}; // 占位符内容

      return () => {
        if (loaded.value) {
          return {type: InnerComp};
        } else if (timeout.value) {
          return options.errorComponent ? {type: options.errorComponent} : placeholder;
        } else {
          return placeholder;
        }
      }
    }
  }
}