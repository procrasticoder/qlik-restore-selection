/*global define */

define(["jquery", "text!./com-qliktech-toolbar.css","qlik"], function($, cssContent, qlik ) {
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			qBookmarkListDef : {
				qType : "bookmark",
				qData : {
					title : "/title",
					description : "/description"
				}
			},
			qFieldListDef : {
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				settings : {
					uses : "settings"
				}
			}
		},
		support: {
			snapshot: false,
			export: true,
			exportData: false
		},
		paint : function($element, layout) {
			//create the app button group
			var html = '', app = qlik.currApp(this);
			html += '<div class="ex-lui-buttongroup">';
			html += '<button id = "bmapply" data-cmd = "bmapply"> Restore Saved Selections </button>';
			html += '<button id = "bmcreate" data-cmd = "bmcreate"> Save </button>';
			html += '</div>';	

			$element.html(html);

			if(window.sessionStorage.getItem('currentStage')=='saved'){
				document.getElementById("bmcreate").innerHTML='Saved';
				document.getElementById("bmcreate").style.backgroundColor='#00b359';
			}
			window.sessionStorage.setItem('currentStage','unsaved');
			

			$element.find('button').on('click', function() {
				switch(this.dataset.cmd) {
					//bookmark actions
					case 'bmapply':
						layout.qBookmarkList.qItems.forEach( function( value) {
							if(value.qMeta && value.qMeta.title) {
								if(value.qMeta.title == 'Last Selection'){
									app.bookmark.apply(value.qInfo.qId)
								}
							}
						});
						break;

					case 'bmcreate':
						layout.qBookmarkList.qItems.forEach( function( value) {
							if(value.qMeta && value.qMeta.title) {
								if(value.qMeta.title == 'Last Selection'){
									app.bookmark.remove(value.qInfo.qId)
								}
							}
						});
						app.bookmark.create('Last Selection', null, qlik.navigation.getCurrentSheetId().sheetId);
						window.sessionStorage.setItem('currentStage','saved');
						break;
				}
			});
			return qlik.Promise.resolve();
		}
	};
	
});


