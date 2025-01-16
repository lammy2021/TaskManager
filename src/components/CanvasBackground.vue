<template>
  <canvas ref="canvas" class="canvas-background"></canvas>
</template>

<script>
export default {
  name: 'CanvasBackground',
  mounted() {
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas;
      const config = this.getConfigOption();
      const context = canvas.getContext('2d');
      let canvasWidth = window.innerWidth;
      let canvasHeight = window.innerHeight;
      const frameFunc = window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (func) {
            window.setTimeout(func, 1000 / 40);
          };

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = config.z;
      canvas.style.opacity = config.o;

      window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      const randomPoints = [];
      for (let i = 0; i < config.n; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const xa = 2 * Math.random() - 1;
        const ya = 2 * Math.random() - 1;
        randomPoints.push({
          x,
          y,
          xa,
          ya,
          max: 12000  // 增加最大距离值
        });
      }

      const currentPoint = { x: null, y: null, max: 20000 };
      const allArray = randomPoints.concat([currentPoint]);

      function drawCanvas() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        randomPoints.forEach((r, idx) => {
          r.x += r.xa;
          r.y += r.ya;
          r.xa *= r.x > canvasWidth || r.x < 0 ? -1 : 1;
          r.ya *= r.y > canvasHeight || r.y < 0 ? -1 : 1;
          context.fillRect(r.x - 0.5, r.y - 0.5, 1, 1);

          for (let i = idx + 1; i < allArray.length; i++) {
            const e = allArray[i];
            const xDist = r.x - e.x;
            const yDist = r.y - e.y;
            const dist = xDist * xDist + yDist * yDist;
            if (dist < e.max * 0.5) {  // 增加难度，只有当距离更近时才绘制连线
              const d = (e.max - dist) / e.max;
              context.beginPath();
              context.lineWidth = d / 2;
              context.moveTo(r.x, r.y);
              context.lineTo(e.x, e.y);
              context.stroke();
            }
          }
        });
        frameFunc(drawCanvas);
      }

      window.onmousemove = (e) => {
        currentPoint.x = e.clientX;
        currentPoint.y = e.clientY;
      };

      window.onmouseout = () => {
        currentPoint.x = null;
        currentPoint.y = null;
      };

      setTimeout(() => {
        drawCanvas();
      }, 100);
    },
    getConfigOption() {
      const scripts = document.getElementsByTagName('script');
      const script = scripts[scripts.length - 1];
      return {
        l: scripts.length,
        z: script.getAttribute('zIndex') || -1,
        o: script.getAttribute('opacity') || 0.8,
        c: script.getAttribute('color') || '255,255,255',
        n: script.getAttribute('count') || 150  // 减少点的数量
      };
    }
  }
};
</script>

<style scoped>
.canvas-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>