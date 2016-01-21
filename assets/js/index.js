(function() {

	// 阻止默认行为
	$(document).on('touchmove', function(ev) {
		ev.preventDefault();
	});

	$(function() {

		fnOrientCheck();

		var $oMain = $('#main');
		var $aSection = $oMain.find('.page');
		var viewHeight = $(window).height();
		$oMain.height(viewHeight);

		fnPageSlide();

		// 切屏代码
		function fnPageSlide() {

			var startY = 0,
				step = 1 / 4,
				currIndex = 0,
				nextOrPrevIndex = 0,
				btnOff = true,
				tl = new TimelineLite(),
				iDist1 = 0,
				iDist2 = 0;

			$aSection.on('touchstart', function(ev) {

				if (btnOff) {

					btnOff = false;
					var touch = ev.originalEvent.changedTouches[0];
					startY = touch.pageY;
					currIndex = $(this).index();

					$aSection.on('touchmove.move', function(ev) {
						tl.clear();
						var touch = ev.originalEvent.changedTouches[0];

						$(this).siblings().hide();
						if (touch.pageY < startY) { //向上滑动
							nextOrPreIndex = currIndex == $aSection.length - 1 ? 0 : currIndex + 1;
							iDist1 = viewHeight + touch.pageY - startY;
						} else { //向下滑动							
							nextOrPreIndex = currIndex == 0 ? $aSection.length - 1 : currIndex - 1;
							iDist1 = -viewHeight + touch.pageY - startY;
						}
						tl.to($aSection.eq(nextOrPreIndex), 0, {
							'transform': 'translateY(' + iDist1 + 'px)'
						}, 0);
						$aSection.eq(nextOrPreIndex).show().addClass('zIndex');
						tl.to($(this), 0, {
							'transform': 'translateY(' + (touch.pageY - startY) * step + 'px)'
						}, 0);

						$aSection.on('touchend.move', function(ev) {
							tl.clear();
							var touch = ev.originalEvent.changedTouches[0];
							if (touch.pageY < startY) { //向上滑动
								iDist2 = -viewHeight * step;
							} else { //向下滑动
								iDist2 = viewHeight * step;
							}

							tl.to($aSection.eq(currIndex), 0.3, {
								'transform': 'translateY(' + iDist2 + 'px)'
							}, 0);
							tl.to($aSection.eq(nextOrPreIndex), 0.3, {
								'transform': 'translateY(0)',
								onComplete: resetFn
							}, 0);
							$aSection.off('.move');
						});

					});
				}

			});

			function resetFn() {
				$aSection.css('transform', '').eq(nextOrPreIndex).removeClass('zIndex').siblings().hide();
				btnOff = true;
			}

		}

		// 横竖屏检测
		function fnOrientCheck() {

			var orientLayer = document.getElementById("orientLayer");
			//判断横屏竖屏
			function checkDirect() {
				if (document.documentElement.clientHeight >= document.documentElement.clientWidth) {
					return "portrait";
				} else {
					return "landscape";
				}
			}
			//显示屏幕方向提示浮层
			function orientNotice() {
				var orient = checkDirect();
				if (orient == "portrait") {
					orientLayer.style.display = "none";
				} else {
					orientLayer.style.display = "block";
				}
			}

			function init() {
				orientNotice();
				window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
					setTimeout(orientNotice, 200);
				})
			}
			init();

		}

	});

})();