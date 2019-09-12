(window.webpackJsonpfrontend=window.webpackJsonpfrontend||[]).push([[0],{150:function(e,t,a){},174:function(e,t,a){"use strict";a.r(t);var r=a(1),n=a.n(r),s=a(23),i=a.n(s),c=(a(67),a(3)),o=a(4),l=a(7),u=a(5),d=a(19),p=a(8),m=a(11),h=a(22),v=a(33),f=a.n(v),y=a(54),b=a(16),E=a(55),g=a(56),S=a(57),O=a(58),j=(a(150),n.a.forwardRef(function(e,t){return n.a.createElement(y.a,Object.assign({},e,{ref:t,defaultView:e.defaultView||"dayGridMonth",header:{left:"prev,next today",center:"title",right:e.editable?"timeGridWeek,timeGridDay":"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},nowIndicator:!0,themeSystem:"bootstrap",plugins:[b.d,E.a,O.a,g.a,S.a]}))}));function w(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}function C(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?w(a,!0).forEach(function(t){Object(m.a)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):w(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var k=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(l.a)(this,Object(u.a)(t).call(this))).state={servers:{},server_names:{},selected_event:n.a.createElement("span",null,"No event selected"),loading:!0,loading_events:!1,events:[]},e}return Object(p.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.props.api.get("/servers").then(function(t){var a=t.data.records,r={},n={},s=!0,i=!1,c=void 0;try{for(var o,l=a[Symbol.iterator]();!(s=(o=l.next()).done);s=!0){var u=o.value;r[u.id]=!1,n[u.id]=u.name}}catch(d){i=!0,c=d}finally{try{s||null==l.return||l.return()}finally{if(i)throw c}}e.setState({loading:!1,servers:r,server_names:n})})}},{key:"componentDidUpdate",value:function(e,t,a){var r=this;if(t.loading_events!==this.state.loading_events){for(var s=1,i={},c=0,o=Object.entries(this.state.servers);c<o.length;c++){var l=o[c],u=Object(h.a)(l,2),d=u[0];u[1]&&(console.log("value",d),i["filter".concat(s)]="ServerId,eq,".concat(d),s+=1)}s>1?this.props.api.get("/events",{params:i}).then(function(e){var t=e.data.records;if(t.length>0){var a=t.map(function(e){return e.UserId}).concat(t.map(function(e){return e.ServerId})).join(",");r.props.api.get("/names/".concat(a)).then(function(e){var a=e.data;e={};var s=!0,i=!1,c=void 0;try{for(var o,l=a[Symbol.iterator]();!(s=(o=l.next()).done);s=!0){var u=o.value;e[u.id]=u.name}}catch(d){i=!0,c=d}finally{try{s||null==l.return||l.return()}finally{if(i)throw c}}t=t.map(function(t){return{start:1e3*t.start,end:1e3*t.end,title:"".concat(e[t.ServerId]," with ").concat(e[t.UserId]),extendedProps:{User:e[t.UserId],Server:e[t.ServerId],ServerId:t.ServerId,UserId:t.UserId}}}),r.setState({loading_events:!1,selected_event:n.a.createElement("span",null,"No event selected"),events:t})})}else r.setState({loading_events:!1,selected_event:n.a.createElement("span",null,"No event selected"),events:[]})}):this.setState({loading_events:!1,selected_event:n.a.createElement("span",null,"No event selected"),events:[]})}}},{key:"render",value:function(){var e=this,t=[],a=function(a){var r=e.state.servers[a],s=e.state.server_names[a];t.push(n.a.createElement("li",{key:a},n.a.createElement("input",{checked:r,onChange:function(t){e.setState({servers:C({},e.state.servers,Object(m.a)({},a,!e.state.servers[a])),loading_events:!0})},type:"checkbox"})," ",s))};for(var r in this.state.servers)a(r);return n.a.createElement("div",null,n.a.createElement("h1",null,"Connected Servers"),n.a.createElement("strong",null,"Players with events this week"),n.a.createElement("div",{style:{display:"flex",justifyContent:"space-around"}},n.a.createElement("div",null,n.a.createElement("ul",{style:{listStyle:"none"}},t)),n.a.createElement("div",{style:{width:"50%"}},n.a.createElement(j,{defaultView:"listWeek",eventClick:function(t){var a=t.event.extendedProps;e.props.api.get("/characters?filter=UserId,eq,".concat(a.UserId,"&filter=ServerId,eq,").concat(a.ServerId)).then(function(t){var r=(t=t.data.records).map(function(e){return e.id}),s=1,i={},c=!0,o=!1,l=void 0;try{for(var u,d=r[Symbol.iterator]();!(c=(u=d.next()).done);c=!0){var p=u.value;i["filter".concat(s)]="CharacterId,eq,".concat(p),s+=1}}catch(m){o=!0,l=m}finally{try{c||null==d.return||d.return()}finally{if(o)throw l}}e.props.api.get("/stories",{params:i}).then(function(r){r=r.data.records;var s=[n.a.createElement("strong",null,a.User,"'s characters and stories on ",a.Server)],i=!0,c=!1,o=void 0;try{for(var l,u=function(){var e=l.value,t=r.filter(function(t){return t.CharacterId===e.id}),a=[],i=!0,c=!1,o=void 0;try{for(var u,d=t[Symbol.iterator]();!(i=(u=d.next()).done);i=!0){var p=u.value;a.push(n.a.createElement("li",{className:"list-group-item"},n.a.createElement("strong",null,p.name),n.a.createElement("p",null,n.a.createElement(f.a,{source:p.description}))))}}catch(m){c=!0,o=m}finally{try{i||null==d.return||d.return()}finally{if(c)throw o}}var h=void 0;a.length>0&&(h=n.a.createElement("ul",{className:"list-group list-group-flush"},a)),s.push(n.a.createElement("div",{className:"card mb-3"},n.a.createElement("div",{className:"card-header"},e.name),n.a.createElement("div",{className:"card-body"},n.a.createElement(f.a,{source:e.description})),h))},d=t[Symbol.iterator]();!(i=(l=d.next()).done);i=!0)u()}catch(m){c=!0,o=m}finally{try{i||null==d.return||d.return()}finally{if(c)throw o}}e.setState({selected_event:s})})})},events:this.state.events}),n.a.createElement("div",null,this.state.selected_event))))}}]),t}(n.a.Component),D=a(12),I=a.n(D),x=a(2);function P(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}var N=function(e){function t(){return Object(c.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){var e=this;return n.a.createElement(x.c,{initialValues:{name:"",ServerId:this.props.servers[0].id,description:""},onSubmit:function(t,a){var r=a.setSubmitting,n=a.resetForm;e.props.api.post("/characters",function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?P(a,!0).forEach(function(t){Object(m.a)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):P(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}({},t)).then(function(t){e.props.onCreate(),r(!1),n()})}},function(t){var a=t.isSubmitting;return n.a.createElement(x.b,{style:{display:"flex",flexDirection:"column"}},n.a.createElement("label",null,"Name"),n.a.createElement(x.a,{className:"form-control",type:"text",name:"name"}),n.a.createElement("label",null,"Server"),n.a.createElement(x.a,{component:"select",name:"ServerId",className:"custom-select"},e.props.servers.map(function(e){return n.a.createElement("option",{value:e.id},e.name)})),n.a.createElement("label",null,"Description (Markdown compatible)"),n.a.createElement(x.a,{type:"textarea",name:"description",className:"form-control"}),n.a.createElement("button",{type:"submit",className:"btn btn-primary",disabled:a},"Add Character"))})}}]),t}(n.a.Component),_=function(e){function t(){return Object(c.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(o.a)(t,[{key:"onDelete",value:function(e){var t=this;this.props.api.delete("/characters/".concat(e)).then(function(e){t.props.onDelete()})}},{key:"render",value:function(){var e=this;return n.a.createElement(x.c,{enableReinitialize:!0,initialValues:{name:this.props.character.name,ServerId:this.props.character.ServerId,description:this.props.character.description},onSubmit:function(t,a){var r=a.setSubmitting;e.props.api.put("/characters/".concat(e.props.character.id),t).then(function(t){e.props.onEdit(),r(!1)})}},function(t){var a=t.isSubmitting;return n.a.createElement(x.b,{style:{display:"flex",flexDirection:"column"}},n.a.createElement("label",null,"Name"),n.a.createElement(x.a,{className:"form-control",type:"text",name:"name"}),n.a.createElement("label",null,"Server"),n.a.createElement(x.a,{component:"select",name:"ServerId",className:"custom-select"},e.props.servers.map(function(e){return n.a.createElement("option",{value:e.id},e.name)})),n.a.createElement("label",null,"Description (Markdown compatible)"),n.a.createElement(x.a,{type:"textarea",name:"description",className:"form-control"}),n.a.createElement("button",{type:"submit",className:"btn btn-primary",disabled:a},"Save Character"),n.a.createElement("button",{type:"button",className:"btn btn-danger",onClick:function(){e.onDelete(e.props.character.id)},disabled:a},"Delete Character"))})}}]),t}(n.a.Component),M=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(l.a)(this,Object(u.a)(t).call(this))).refreshCharacters=function(){e.props.api.get("/characters").then(function(t){e.setState({characters:t.data.records})})},e.handleDelete=function(){e.refreshCharacters(),e.clearEditCharacter()},e.clearEditCharacter=function(){e.setState({editCharacter:null})},e.setEditCharacter=function(t){var a=e.state.characters[t];e.setState({editCharacter:a})},e.state={loading:!0,editCharacter:null,characters:[],servers:[]},e}return Object(p.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=this;I.a.all([this.props.api.get("/characters"),this.props.api.get("/servers")]).then(I.a.spread(function(t,a){e.setState({loading:!1,characters:t.data.records,servers:a.data.records})}))}},{key:"render",value:function(){var e=this;return this.state.loading?n.a.createElement("div",null,"Loading"):n.a.createElement("div",null,n.a.createElement("h1",null,"My Characters"),n.a.createElement("div",{style:{display:"flex",justifyContent:"space-around"}},n.a.createElement("div",{className:"list-group"},n.a.createElement("button",{className:this.state.editCharacter?"list-group-item list-group-item-action":"list-group-item list-group-item-action active",onClick:function(){e.clearEditCharacter()}},"Add New Character"),this.state.characters.map(function(t,a){return n.a.createElement("button",{className:e.state.editCharacter===t?"list-group-item list-group-item-action active":"list-group-item list-group-item-action",key:t.id,onClick:function(){e.setEditCharacter(a)}},t.name)})),n.a.createElement("div",{style:{width:"50%"}},this.state.editCharacter?n.a.createElement(_,{servers:this.state.servers,api:this.props.api,character:this.state.editCharacter,onEdit:this.refreshCharacters,onDelete:this.handleDelete}):n.a.createElement(N,{servers:this.state.servers,api:this.props.api,onCreate:this.refreshCharacters}))))}}]),t}(n.a.Component);function A(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}var R=function(e){function t(){return Object(c.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){var e=this;return this.props.characters[0]?n.a.createElement(x.c,{initialValues:{name:"",CharacterId:this.props.characters[0].id,description:""},onSubmit:function(t,a){var r=a.setSubmitting,n=a.resetForm;e.props.api.post("/stories",function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?A(a,!0).forEach(function(t){Object(m.a)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):A(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}({},t)).then(function(t){e.props.onCreate(),r(!1),n()})}},function(t){var a=t.isSubmitting;return n.a.createElement(x.b,{style:{display:"flex",flexDirection:"column"}},n.a.createElement("label",null,"Title"),n.a.createElement(x.a,{className:"form-control",type:"text",name:"name"}),n.a.createElement("label",null,"Character"),n.a.createElement(x.a,{component:"select",name:"CharacterId",className:"custom-select"},e.props.characters.map(function(e){return n.a.createElement("option",{value:e.id},e.name)})),n.a.createElement("label",null,"Description (Markdown compatible)"),n.a.createElement(x.a,{type:"textarea",name:"description",className:"form-control"}),n.a.createElement("button",{type:"submit",className:"btn btn-primary",disabled:a},"Add Story"))}):n.a.createElement("div",{class:"alert alert-warning",role:"alert"},"You need characters before you can make stories!")}}]),t}(n.a.Component),U=function(e){function t(){return Object(c.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(o.a)(t,[{key:"onDelete",value:function(e){var t=this;this.props.api.delete("/stories/".concat(e)).then(function(e){t.props.onDelete()})}},{key:"render",value:function(){var e=this;return n.a.createElement(x.c,{enableReinitialize:!0,initialValues:{name:this.props.story.name,CharacterId:this.props.story.CharacterId,description:this.props.story.description},onSubmit:function(t,a){var r=a.setSubmitting;e.props.api.put("/stories/".concat(e.props.story.id),t).then(function(t){e.props.onEdit(),r(!1)})}},function(t){var a=t.isSubmitting;return n.a.createElement(x.b,{style:{display:"flex",flexDirection:"column"}},n.a.createElement("label",null,"Title"),n.a.createElement(x.a,{className:"form-control",type:"text",name:"name"}),n.a.createElement("label",null,"Character"),n.a.createElement(x.a,{component:"select",name:"CharacterId",className:"custom-select"},e.props.characters.map(function(e){return n.a.createElement("option",{value:e.id},e.name)})),n.a.createElement("label",null,"Description (Markdown compatible)"),n.a.createElement(x.a,{type:"textarea",name:"description",className:"form-control"}),n.a.createElement("button",{type:"submit",className:"btn btn-primary",disabled:a},"Save Story"),n.a.createElement("button",{type:"button",className:"btn btn-danger",onClick:function(){e.onDelete(e.props.story.id)},disabled:a},"Delete Story"))})}}]),t}(n.a.Component),L=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(l.a)(this,Object(u.a)(t).call(this))).refreshStories=function(){e.props.api.get("/stories").then(function(t){e.setState({stories:t.data.records})})},e.handleDelete=function(){e.refreshStories(),e.clearEditStory()},e.clearEditStory=function(){e.setState({editStory:null})},e.setEditStory=function(t){var a=e.state.stories[t];e.setState({editStory:a})},e.state={loading:!0,editStory:null,stories:[],characters:[]},e}return Object(p.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=this;I.a.all([this.props.api.get("/stories"),this.props.api.get("/characters")]).then(I.a.spread(function(t,a){e.setState({loading:!1,stories:t.data.records,characters:a.data.records})}))}},{key:"render",value:function(){var e=this;return this.state.loading?n.a.createElement("div",null,"Loading"):n.a.createElement("div",null,n.a.createElement("h1",null,"My Story Ideas"),n.a.createElement("div",{style:{display:"flex",justifyContent:"space-around"}},n.a.createElement("div",{className:"list-group"},n.a.createElement("button",{className:this.state.editStory?"list-group-item list-group-item-action":"list-group-item list-group-item-action active",onClick:function(){e.clearEditStory()}},"Add New Story"),this.state.stories.map(function(t,a){return n.a.createElement("button",{className:e.state.editStory===t?"list-group-item list-group-item-action active":"list-group-item list-group-item-action",key:t.id,onClick:function(){e.setEditStory(a)}},t.name)})),n.a.createElement("div",{style:{width:"50%"}},this.state.editStory?n.a.createElement(U,{characters:this.state.characters,api:this.props.api,story:this.state.editStory,onEdit:this.refreshStories,onDelete:this.handleDelete}):n.a.createElement(R,{characters:this.state.characters,api:this.props.api,onCreate:this.refreshStories}))))}}]),t}(n.a.Component);function V(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}function z(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?V(a,!0).forEach(function(t){Object(m.a)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):V(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var G=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(l.a)(this,Object(u.a)(t).call(this))).getConflicts=function(e,t){return[e.start>=t.start&&e.start<=t.end,e.end>=t.start&&e.end<=t.end,e.start<=t.start&&e.end>=t.end]},e.handleConflict=function(e,t,a,r,n,s){var i=!0;return a?s?e.remove():(i=!1,e.setEnd(t.end),e.setStart(t.start)):(r&&(s?e.setEnd(t.start):(i=!1,e.setEnd(t.end))),n&&(s?e.setStart(t.end):(i=!1,e.setStart(t.start)))),!s&&i},e.handleEvent=function(t,a){var r=e.calRef.current.getApi(),n=r.getEvents(),s={};if(!t.extendedProps)for(var i in e.state.servers)s[i]=!0;var c=!0,o=!1,l=void 0;try{for(var u,d=n[Symbol.iterator]();!(c=(u=d.next()).done);c=!0){var p=u.value;if(!1===p.allDay){var m=e.getConflicts(t,p),v=Object(h.a)(m,3),f=v[0],y=v[1],b=v[2];if(t.extendedProps)t.extendedProps.ServerId===p.extendedProps.ServerId&&e.handleConflict(p,t,b,f,y,a);else for(var E in e.state.servers){e.state.servers[E]&&p.extendedProps.ServerId===E&&(s[E]=e.handleConflict(p,t,b,f,y,a))}}}}catch(O){o=!0,l=O}finally{try{c||null==d.return||d.return()}finally{if(o)throw l}}if(!a)for(var g in e.state.servers){if(e.state.servers[g]&&s[g]){var S=r.addEvent(t);S.setProp("title",e.state.server_names[g]),S.setExtendedProp("ServerId",g)}}e.setState({selected_range:null})},e.handleRemove=function(){e.state.selected_range&&e.handleEvent(e.state.selected_range,!0)},e.handleResize=function(t){e.handleEvent(t.event)},e.handleDrop=function(t){e.handleEvent(t.event)},e.handleAdd=function(){e.state.selected_range&&e.handleEvent(e.state.selected_range)},e.state={loading:!0,selected_range:null,servers:{},server_names:{}},e.calRef=n.a.createRef(),e}return Object(p.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.props.api.get("/servers").then(function(t){var a=t.data.records,r={},n={},s=!0,i=!1,c=void 0;try{for(var o,l=a[Symbol.iterator]();!(s=(o=l.next()).done);s=!0){var u=o.value;r[u.id]=!1,n[u.id]=u.name}}catch(d){i=!0,c=d}finally{try{s||null==l.return||l.return()}finally{if(i)throw c}}return e.setState({loading:!1,saveStatus:0,servers:r,server_names:n}),e.props.api.get("/events")}).then(function(t){var a=e.calRef.current.getApi(),r=t.data.records,n=!0,s=!1,i=void 0;try{for(var c,o=r[Symbol.iterator]();!(n=(c=o.next()).done);n=!0){var l=c.value;a.addEvent({start:1e3*l.start,end:1e3*l.end,title:e.state.server_names[l.ServerId],extendedProps:{ServerId:l.ServerId}})}}catch(u){s=!0,i=u}finally{try{n||null==o.return||o.return()}finally{if(s)throw i}}})}},{key:"render",value:function(){var e=this;if(this.state.loading)return n.a.createElement("div",null,"Loading");var t=[],a=function(a){var r=e.state.servers[a],s=e.state.server_names[a];t.push(n.a.createElement("li",{key:a},n.a.createElement("input",{checked:r,onChange:function(t){e.setState({servers:z({},e.state.servers,Object(m.a)({},a,t.target.checked))})},type:"checkbox"})," ",s))};for(var r in this.state.servers)a(r);return n.a.createElement("div",null,n.a.createElement("h1",null,"Set Availability"),n.a.createElement("div",{style:{display:"flex",justifyContent:"space-around"}},n.a.createElement("div",{style:{width:"25%"}},n.a.createElement("h2",null,"My Servers"),n.a.createElement("ul",{style:{listStyle:"none"}},t)),n.a.createElement("div",{style:{width:"50%"}},[n.a.createElement("div",null,"\xa0"),n.a.createElement("div",null,"Saving..."),n.a.createElement("div",null,"Saved")][this.state.saveStatus],n.a.createElement("div",{className:"form-group",style:{display:"flex",justifyContent:"space-around"}},n.a.createElement("button",{className:"btn btn-success",onClick:this.handleAdd},"Available"),n.a.createElement("button",{className:"btn btn-danger",onClick:this.handleRemove},"Unavailable"),n.a.createElement("button",{className:"btn btn-primary",onClick:function(){var t=e.calRef.current.getApi().getEvents(),a=function(e){return Math.round(e.getTime()/1e3)};t=t.map(function(e){return{start:a(e.start),end:a(e.end),ServerId:e.extendedProps.ServerId}}),e.setState({saveStatus:1},function(){e.props.api.post("/events",t).then(function(t){e.setState({saveStatus:2})})})}},"Save")),n.a.createElement(j,{ref:this.calRef,defaultView:"timeGridWeek",selectable:!0,editable:!0,allDaySlot:!1,select:function(t){e.setState({selected_range:t})},eventResize:this.handleResize,eventDrop:this.handleDrop}))))}}]),t}(n.a.Component),W=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(l.a)(this,Object(u.a)(t).call(this))).state={section:""},e.setSection=e.setSection.bind(Object(d.a)(e)),e}return Object(p.a)(t,e),Object(o.a)(t,[{key:"setSection",value:function(e,t){e.preventDefault(),this.setState({section:t})}},{key:"render",value:function(){var e=this;return n.a.createElement("div",null,this.props.user?n.a.createElement("menu",{style:{display:"flex",justifyContent:"space-around",listStyle:"none"}},n.a.createElement("li",null,n.a.createElement("button",{className:"btn btn-secondary",onClick:function(t){return e.setSection(t,"MyAvailability")}},"My Availability")),n.a.createElement("li",null,n.a.createElement("button",{className:"btn btn-secondary",onClick:function(t){return e.setSection(t,"ConnectedServers")}},"Connected Servers")),n.a.createElement("li",null,n.a.createElement("button",{className:"btn btn-secondary",onClick:function(t){return e.setSection(t,"MyCharacters")}},"My Characters")),n.a.createElement("li",null,n.a.createElement("button",{className:"btn btn-secondary",onClick:function(t){return e.setSection(t,"MyStoryIdeas")}},"My Story Ideas")),n.a.createElement("li",null,n.a.createElement("button",{class:"btn btn-secondary",onClick:function(e){e.preventDefault(),window.localStorage.removeItem("token"),document.location.replace("https://kinostl.github.io/rp-schedule-tool/")}},"Logout"))):null,n.a.createElement("div",{class:"mx-5"},this.props.user?function(){switch(e.state.section){case"MyAvailability":return n.a.createElement(G,{api:e.props.api});case"ConnectedServers":return n.a.createElement(k,{api:e.props.api});case"MyCharacters":return n.a.createElement(M,{api:e.props.api});case"MyStoryIdeas":return n.a.createElement(L,{api:e.props.api});default:return n.a.createElement("div",{class:"jumbotron text-center"},n.a.createElement("h1",{class:"display-4"},"RP Scheduler"),n.a.createElement("p",{class:"lead"},"A tool to help you schedule Roleplaying sessions!"),n.a.createElement("hr",{class:"my-4"}),n.a.createElement("strong",null,"If you have any suggestions you can click ",n.a.createElement("a",{href:"https://github.com/kinostl/rp-schedule-tool/issues"},"here")," or on the top right"),n.a.createElement("p",null,"You can add your characters, story ideas, and list your available timeslots."),n.a.createElement("p",null,"All your entries are siloed to individual Discord servers."),n.a.createElement("p",null,"List your availability with My Ability"),n.a.createElement("p",null,"See events on your servers with Connected Servers"),n.a.createElement("p",null,"List your characters with My Characters"),n.a.createElement("p",null,"List your story ideas with My Stories Ideas"),n.a.createElement("p",null,"Your Story Ideas and Characters will appear under Connected Servers for all users you share a server with."))}}():n.a.createElement("div",{class:"jumbotron mt-5 text-center"},n.a.createElement("h1",{class:"display-4"},"RP Scheduler"),n.a.createElement("p",{class:"lead"},"A tool to help you schedule Roleplaying sessions!"),n.a.createElement("hr",{class:"my-4"}),n.a.createElement("p",null,"You can add your characters, story ideas, and list your available timeslots."),n.a.createElement("p",null,"All your entries are siloed to individual Discord servers."),n.a.createElement("button",{class:"btn btn-primary btn-lg",onClick:function(e){e.preventDefault(),document.location.replace("".concat("https://mintytech.com:8080","/login"))}},"Login using Discord!"))))}}]),t}(n.a.Component),B=function(e){function t(){return Object(c.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return n.a.createElement("div",{style:{width:"75%",marginLeft:"auto",marginRight:"auto"}},"Loading...")}}]),t}(n.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(171);if(i.a.render(n.a.createElement(B,null),document.getElementById("root")),window.location.hash.length>0){var q="Bearer "+window.location.hash.substr(1);window.localStorage.setItem("token",q),document.location.replace("https://kinostl.github.io/rp-schedule-tool/")}else if(window.localStorage.getItem("token")){var Y=window.localStorage.getItem("token");I.a.get("".concat("https://mintytech.com:8080","/api/records/me"),{headers:{"X-Authorization":Y}}).then(function(e){var t=I.a.create({baseURL:"".concat("https://mintytech.com:8080","/api/records"),headers:{"X-Authorization":Y},timeout:3e3});i.a.render(n.a.createElement(W,{api:t,user:e.data}),document.getElementById("root"))})}else{var T=I.a.create({baseURL:"".concat("https://mintytech.com:8080","/api/records"),timeout:3e3});i.a.render(n.a.createElement(W,{api:T}),document.getElementById("root"))}"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},62:function(e,t,a){e.exports=a(174)},67:function(e,t,a){}},[[62,1,2]]]);
//# sourceMappingURL=main.7d32fc1f.chunk.js.map