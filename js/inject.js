const isWhatsappLoaded = () => !!document.querySelector("#pane-side"),
	isWebpackLoaded = () => "function" == typeof webpackJsonp || window.webpackChunkwhatsapp_web_client || window.require,
	sleep = e => new Promise((t => setTimeout(t, e)));
console.logSuccess = e => console.log(`%c${e}`, "color: lightGreen; font-weight: bold; font-size: 14px;"), console.logError = e => console.log(`%c${e}`, "color: red; font-weight: bold;"), console.logWarn = e => console.log(`%c${e}`, "color: orange; font-weight: bold;");
const initStore = function (e = !0)
	{
		return e ? initStoreOld() : initStoreNew()
	},
	initStoreOld = function ()
	{
		const e = function ()
		{
			return e.mID = Math.random().toString(36).substring(7), e.mObj = {}, (window.webpackChunkbuild || window.webpackChunkwhatsapp_web_client).push([
				[e.mID],
				{},
				function (t)
				{
					Object.keys(t.m).forEach((function (o)
					{
						e.mObj[o] = t(o)
					}))
				}
			]),
			{
				modules: e.mObj,
				constructors: e.cArr,
				findModule: function (t)
				{
					let o = [];
					return Object.keys(e.mObj).forEach((function (n)
					{
						let i = e.mObj[n];
						if (void 0 !== i)
							if ("string" == typeof t)
							{
								if ("object" == typeof i.default)
									for (let e in i.default) e == t && o.push(i);
								for (let e in i) e == t && o.push(i)
							}
						else
						{
							if ("function" != typeof t) throw new TypeError("findModule can only find via string and function, " + typeof t + " was passed");
							t(i) && o.push(i)
						}
					})), o
				},
				get: function (t)
				{
					return e.mObj[t]
				}
			}
		};
		return new Promise(((t, o) =>
		{
			try
			{
				if (window.require && window.importDefault)
				{
					const e = e => window.require(e),
						t = e => window.importDefault(e);
					window.Store = {
						Chat: e("WAWebChatCollection")?.ChatCollection,
						Contact: e("WAWebContactCollection")?.ContactCollection,
						Msg: e("WAWebMsgCollection")?.MsgCollection,
						MsgKey: t("WAWebMsgKey"),
						BusinessProfile: e("WAWebBusinessProfileCollection")?.BusinessProfileCollection,
						GroupMetadata: t("WAWebGroupMetadataCollection"),
						TextMsgChatAction: e("WAWebSendTextMsgChatAction"),
						MediaCollection: t("WAWebAttachMediaCollection"),
						UserConstructor: t("WAWebWid"),
						EnumTypes: e("WAWebWamEnumMediaPickerOriginType")
					}, window.Store && (window.Store.InitType = "old_method_1")
				}
				else
				{
					let t = e();
					window.Store = Object.assign(
					{}, t.findModule((e => e.default && e.default.Chat))[0]?.default ||
					{}), window.Store.MediaCollection = t.findModule((e => e.default && e.default.prototype?.processAttachments))[0]?.default, window.Store.UserConstructor = t.findModule((e => e.default && e.default.prototype?.isServer && e.default.prototype?.isUser))[0]?.default, window.Store.TextMsgChatAction = t.findModule("sendTextMsgToChat")[0], window.Store.WidFactory = t.findModule("createWid")[0], window.Store.Cmd = t.findModule("Cmd")[0]?.Cmd, window.Store.ChatState = t.findModule("sendChatStateComposing")[0], window.Store.ContactMethods = t.findModule("getUserid")[0], window.Store.ChatHelper = t.findModule("findChat")[0], window.Store.EnumTypes = t.findModule("MEDIA_PICKER_ORIGIN_TYPE")[0], window.Store.MenuClasses = t.findModule((e => e?.default?.menu && e?.default?.item ? e.default : null))[0]?.default, window.Store && (window.Store.InitType = "old_method_2")
				}
				window.Store?.Chat?.modelClass?.prototype && (window.Store.Chat.modelClass.prototype.sendMessage = function (e)
				{
					window.Store.TextMsgChatAction.sendTextMsgToChat(this, ...arguments)
				}), window.Store?.Chat && !window.Store.Chat._find && (window.Store.Chat._findAndParse = window.Store.BusinessProfile?._findAndParse, window.Store.Chat._find = window.Store.BusinessProfile?._find), t()
			}
			catch (e)
			{
				o("InjectJS :: initStoreOld :: Error :: " + e)
			}
		}))
	},
	initStoreNew = function ()
	{
		let e = [
		{
			id: "MediaCollection",
			module: "WAWebAttachMediaCollection",
			conditions: e => e.default && e.default.prototype && (void 0 !== e.default.prototype.processFiles || void 0 !== e.default.prototype.processAttachments) ? e.default : null
		},
		{
			id: "Archive",
			module: "WAWebSetArchiveChatAction",
			conditions: e => e.setArchive ? e : null
		},
		{
			id: "Block",
			module: "WAWebBlockContactUtils",
			conditions: e => e.blockContact && e.unblockContact ? e : null
		},
		{
			id: "ChatUtil",
			module: "WAWebSendClearChatAction",
			conditions: e => e.sendClear ? e : null
		},
		{
			id: "GroupInvite",
			module: "WAWebGroupInviteJob",
			conditions: e => e.queryGroupInviteCode ? e : null
		},
		{
			id: "Wap",
			module: "WAWebCreateGroupAction",
			conditions: e => e.createGroup ? e : null
		},
		{
			id: "State",
			module: "WAWebSocketModel",
			conditions: e => e.STATE && e.STREAM ? e : null
		},
		{
			id: "_Presence",
			module: "WAWebContactPresenceBridge",
			conditions: e => e.setPresenceAvailable && e.setPresenceUnavailable ? e : null
		},
		{
			id: "WapDelete",
			module: "WAWebChatDeleteBridge",
			conditions: e => e.sendConversationDelete && 2 == e.sendConversationDelete.length ? e : null
		},
		{
			id: "WapQuery",
			module: "WAWebQueryExistsJob",
			conditions: e => e.queryExist ? e : e.default && e.default.queryExist ? e.default : null
		},
		{
			id: "UserConstructor",
			module: "WAWebWid",
			conditions: e => e.default && e.default.prototype && e.default.prototype.isServer && e.default.prototype.isUser ? e.default : null
		},
		{
			id: "SendTextMsgToChat",
			module: "WAWebSendTextMsgChatAction",
			resolver: e => e.sendTextMsgToChat
		},
		{
			id: "ReadSeen",
			module: "WAWebUpdateUnreadChatAction",
			conditions: e => e.sendSeen ? e : null
		},
		{
			id: "sendDelete",
			module: "WAWebDeleteChatAction",
			conditions: e => e.sendDelete ? e.sendDelete : null
		},
		{
			id: "addAndSendMsgToChat",
			module: "WAWebSendMsgChatAction",
			conditions: e => e.addAndSendMsgToChat ? e.addAndSendMsgToChat : null
		},
		{
			id: "Catalog",
			module: "WAWebCatalogCollection",
			conditions: e => e.Catalog ? e.Catalog : null
		},
		{
			id: "MsgKey",
			module: "WAWebMsgKey",
			conditions: e => e.default && e.default.toString && e.default.toString().includes("MsgKey error: obj is null/undefined") ? e.default : null
		},
		{
			id: "Parser",
			module: "WAWebE2EProtoUtils",
			conditions: e => e.convertToTextWithoutSpecialEmojis ? e.default : null
		},
		{
			id: "Builders",
			module: "WAWebProtobufsE2E.pb",
			conditions: e => e.TemplateMessage && e.HydratedFourRowTemplate ? e : null
		},
		{
			id: "Me",
			module: "WAWebUserPrefsMeUser",
			conditions: e => e.PLATFORMS && e.Conn ? e.default : null
		},
		{
			id: "MyStatus",
			module: "WAWebContactStatusBridge",
			conditions: e => e.getStatus && e.setMyStatus ? e : null
		},
		{
			id: "ChatStates",
			module: "WAWebChatStateBridge",
			conditions: e => e.sendChatStatePaused && e.sendChatStateRecording && e.sendChatStateComposing ? e : null
		},
		{
			id: "GroupActions",
			module: "WAWebExitGroupAction",
			conditions: e => e.sendExitGroup && e.localExitGroup ? e : null
		},
		{
			id: "Participants",
			module: "WAWebGroupsParticipantsApi",
			conditions: e => e.addParticipants && e.removeParticipants && e.promoteParticipants && e.demoteParticipants ? e : null
		},
		{
			id: "WidFactory",
			module: "WAWebWidFactory",
			conditions: e => e.isWidlike && e.createWid && e.createWidFromWidLike ? e : null
		},
		{
			id: "Sticker",
			module: "WAWebStickerPackCollection",
			resolver: e => e.StickerPackCollection,
			conditions: e => e.default && e.default.Sticker ? e.default.Sticker : null
		},
		{
			id: "UploadUtils",
			module: "WAWebUploadManager",
			conditions: e => e.default && e.default.encryptAndUpload ? e.default : null
		}];
		return new Promise(((t, o) =>
		{
			try
			{
				const o = e => require("__debug").modulesMap[e] || !1,
					n = e =>
					{
						const t = o(e);
						return !!t && (null != t.dependencies && t.depPosition >= t.dependencies.length)
					};
				e.map((e =>
				{
					const t = e.module;
					if (t && o(t) && n(t))
					{
						let o = require(t);
						e.foundedModule = o
					}
				})), window.Store = {
					...
					{
						...require("WAWebCollections")
					},
					...window.Store ||
					{}
				}, e.forEach((e =>
				{
					e.foundedModule && (window.Store[e.id] = e.resolver ? e.resolver(e.foundedModule) : e.foundedModule)
				})), window.Store.Chat && (window.Store.Chat.modelClass.prototype.sendMessage = function (e)
				{
					window.Store.SendTextMsgToChat(this, ...arguments)
				}), window.Store && (window.Store.InitType = "new_method"), t()
			}
			catch (e)
			{
				o("InjectJS :: initStoreNew :: Error :: " + e)
			}
		}))
	},
	initPross = function ()
	{
		window.PROSS = {
			lastRead:
			{}
		}, window.PROSS._serializeRawObject = e =>
		{
			if (e)
			{
				let t = {};
				e = e.toJSON ? e.toJSON() :
				{
					...e
				};
				for (let o in e)
					if ("statusMute" !== o & "disappearingModeDuration" !== o & "disappearingModeSettingTimestamp" !== o & "forcedBusinessUpdateFromServer" !== o & "privacyMode" !== o & "sectionHeader" !== o & "verifiedLevel" !== o)
					{
						if ("id" === o)
						{
							t[o] = {
								...e[o]
							};
							continue
						}
						if ("object" == typeof e[o] && !Array.isArray(e[o]))
						{
							t[o] = window.PROSS._serializeRawObject(e[o]);
							continue
						}
						if (Array.isArray(e[o]))
						{
							t[o] = e[o].map((e => "object" == typeof e ? window.PROSS._serializeRawObject(e) : e));
							continue
						}
						t[o] = e[o]
					} return t
			}
			return {}
		}, window.PROSS._serializeContactObject = e => null == e ? null : Object.assign(window.PROSS._serializeRawObject(e),
		{
			formattedName: e.formattedName,
			displayName: e.displayName,
			isMe: e.isMe,
			isMyContact: e.isMyContact,
			isPSA: e.isPSA,
			isUser: e.isUser,
			isVerified: e.isVerified,
			isWAContact: e.isWAContact
		}), window.PROSS.getGroupMetadata = async function (e, t)
		{
			let o = window.Store.GroupMetadata.get(e);
			return void 0 !== o && o.stale && await window.Store.GroupMetadata.update(e), void 0 !== t && t(o), o
		}, window.PROSS.sendAttachment = function (e, t, o, n)
		{
			return new Promise(((n, i) =>
			{
				try
				{
					let s = Store.Chat.get(t);
					var a = new Store.MediaCollection(s);
					a.processAttachments([
					{
						file: e
					}, 1], s, s).then((() =>
					{
						try
						{
							var e = a._models[0];
							let t = {
								quotedMsg: !1,
								isCaptionByUser: !0,
								type: a._models[0].type
							};
							/\S/.test(o) && (t.caption = o), e.sendToChat(s, t), n()
						}
						catch (e)
						{
							i(e)
						}
					}))
				}
				catch (e)
				{
					i(e)
				}
			}))
		}, window.PROSS.getMyContacts = function (e)
		{
			const t = window.Store.Contact.filter((e => 1 === e.isAddressBookContact)).map((e => PROSS._serializeContactObject(e)));
			return e && e(t), t
		}, window.PROSS.getMyUnsavedContacts = function (e)
		{
			const t = window.Store.Contact.filter((e => "c.us" === e?.__x_id?.server && 0 === e?.isAddressBookContact && !0 !== e?.isBusiness)).map((e => (
			{
				user: e.id.user,
				pushname: e.pushname || "Unknown"
			})));
			return e && e(t), t
		}, window.PROSS.getAllContacts = function (e)
		{
			const t = window.Store.Contact.filter((e => "c.us" === e?.__x_id?.server && 1 === e?.isAddressBookContact && !0 !== e?.isBusiness));
			return void 0 !== e && e(t), t
		}, window.PROSS.getAllGroups = function (e)
		{
			const t = window.Store.Chat.filter((e => e.isGroup));
			return e && e(t), t
		}, window.PROSS.getChat = function (e, t)
		{
			e = "string" == typeof e ? e : e._serialized;
			const o = window.Store.Chat.get(e);
			return o.sendMessage = o.sendMessage ? o.sendMessage : function ()
			{
				return window.Store.sendMessage.apply(this, arguments)
			}, void 0 !== t && t(o), o
		}, window.PROSS.sendMessage = function (e, t)
		{
			return new Promise(((o, n) =>
			{
				try
				{
					var i = PROSS.getChat(e);
					void 0 !== i ? (i.sendMessage(t), o()) : n("chat or group not found")
				}
				catch (e)
				{
					n(e)
				}
			}))
		}, window.PROSS.base64toFile = function (e, t)
		{
			let o = e.split(","),
				n = o[0].match(/:(.*?);/)[1],
				i = atob(o[1]),
				a = i.length,
				s = new Uint8Array(a);
			for (; a--;) s[a] = i.charCodeAt(a);
			return new File([s], t,
			{
				type: n
			})
		}
	};
var initStoreInterval = null,
	initStoreRetryCount = 0;
const initMain = function (e = !0)
{
	clearInterval(initStoreInterval), initStoreRetryCount = 0, initStoreInterval = setInterval((() =>
	{
		if (isWhatsappLoaded() && ("function" == typeof webpackJsonp || window.webpackChunkwhatsapp_web_client || window.require)) initStore(e).then((() =>
		{
			if (window.PROSS = {
					lastRead:
					{}
				}, window.PROSS._serializeRawObject = e =>
				{
					if (e)
					{
						let t = {};
						e = e.toJSON ? e.toJSON() :
						{
							...e
						};
						for (let o in e)
							if ("statusMute" !== o & "disappearingModeDuration" !== o & "disappearingModeSettingTimestamp" !== o & "forcedBusinessUpdateFromServer" !== o & "privacyMode" !== o & "sectionHeader" !== o & "verifiedLevel" !== o)
							{
								if ("id" === o)
								{
									t[o] = {
										...e[o]
									};
									continue
								}
								if ("object" == typeof e[o] && !Array.isArray(e[o]))
								{
									t[o] = window.PROSS._serializeRawObject(e[o]);
									continue
								}
								if (Array.isArray(e[o]))
								{
									t[o] = e[o].map((e => "object" == typeof e ? window.PROSS._serializeRawObject(e) : e));
									continue
								}
								t[o] = e[o]
							} return t
					}
					return {}
				}, window.PROSS._serializeContactObject = e => null == e ? null : Object.assign(window.PROSS._serializeRawObject(e),
				{
					formattedName: e.formattedName,
					displayName: e.displayName,
					isMe: e.isMe,
					isMyContact: e.isMyContact,
					isPSA: e.isPSA,
					isUser: e.isUser,
					isVerified: e.isVerified,
					isWAContact: e.isWAContact
				}), window.PROSS.getGroupMetadata = async function (e, t)
				{
					let o = window.Store.GroupMetadata.get(e);
					return void 0 !== o && o.stale && await window.Store.GroupMetadata.update(e), void 0 !== t && t(o), o
				}, window.PROSS.sendAttachment = function (e, t, o, n)
				{
					return new Promise(((n, i) =>
					{
						try
						{
							let s = Store.Chat.get(t);
							var a = new Store.MediaCollection(s);
							a.processAttachments([
							{
								file: e
							}, 1], s, s).then((() =>
							{
								try
								{
									var e = a._models[0];
									let t = {
										quotedMsg: !1,
										isCaptionByUser: !0,
										type: a._models[0].type
									};
									/\S/.test(o) && (t.caption = o), e.sendToChat(s, t), n()
								}
								catch (e)
								{
									i(e)
								}
							}))
						}
						catch (e)
						{
							i(e)
						}
					}))
				}, window.PROSS.getMyContacts = function (e)
				{
					const t = window.Store.Contact.filter((e => 1 === e.isAddressBookContact)).map((e => PROSS._serializeContactObject(e)));
					return e && e(t), t
				}, window.PROSS.getMyUnsavedContacts = function (e)
				{
					const t = window.Store.Contact.filter((e => "c.us" === e?.__x_id?.server && 0 === e?.isAddressBookContact && !0 !== e?.isBusiness)).map((e => (
					{
						user: e.id.user,
						pushname: e.pushname || "Unknown"
					})));
					return e && e(t), t
				}, window.PROSS.getAllContacts = function (e)
				{
					const t = window.Store.Contact.filter((e => "c.us" === e?.__x_id?.server && 1 === e?.isAddressBookContact && !0 !== e?.isBusiness));
					return void 0 !== e && e(t), t
				}, window.PROSS.getAllGroups = function (e)
				{
					const t = window.Store.Chat.filter((e => "g.us" === e?.__x_id?.server));
					return e && e(t), t
				}, window.PROSS.getChat = function (e, t)
				{
					e = "string" == typeof e ? e : e._serialized;
					const o = window.Store.Chat.get(e);
					return o.sendMessage = o.sendMessage ? o.sendMessage : function ()
					{
						return window.Store.sendMessage.apply(this, arguments)
					}, void 0 !== t && t(o), o
				}, window.PROSS.sendMessage = function (e, t)
				{
					return new Promise(((o, n) =>
					{
						try
						{
							var i = PROSS.getChat(e);
							void 0 !== i ? (i.sendMessage(t), o()) : n("chat or group not found")
						}
						catch (e)
						{
							n(e)
						}
					}))
				}, window.PROSS.base64toFile = function (e, t)
				{
					let o = e.split(","),
						n = o[0].match(/:(.*?);/)[1],
						i = atob(o[1]),
						a = i.length,
						s = new Uint8Array(a);
					for (; a--;) s[a] = i.charCodeAt(a);
					return new File([s], t,
					{
						type: n
					})
				}, window.Store && window.PROSS) console.logSuccess(`InjectJS :: initMain - Success :: useOldMethod = ${e}`), clearInterval(initStoreInterval);
			else
			{
				initStoreRetryCount++;
				const t = window.PROSS ? "Store" : "PROSS";
				console.logError(`InjectJS :: initMain - Error :: ${t} is not initialized! :: useOldMethod = ${e}`)
			}
		})).catch((e =>
		{
			initStoreRetryCount++, console.logError("InjectJS :: initMain - Error :: " + e)
		}));
		else
		{
			const e = isWhatsappLoaded() ? "Webpack" : "Whatsapp";
			console.logWarn(`InjectJS :: initMain - Warn :: ${e} is not loaded yet.`)
		}
		e || 5 != initStoreRetryCount || (console.logWarn("InjectJS :: initMain - Reload :: useOldMethod = true"), initMain(!0))
	}), 1e3)
};
initMain(!0), window.addEventListener("PROSS::init", (function (e)
{
	const t = e.detail.useOldMethod;
	initMain(t)
})), window.addEventListener("PROSS::send-attachments", (async function (e)
{
	const t = e.detail.attachments,
		o = e.detail.caption,
		n = e.detail.number + "@c.us";
	try
	{
		const e = t.map((async (e, t) =>
		{
			const i = await JSON.parse(e.data),
				a = await window.PROSS.base64toFile(i, e.name);
			await window.PROSS.sendAttachment(a, n, o[t])
		}));
		await Promise.all(e), window.postMessage(
		{
			type: "send_attachments",
			payload:
			{
				chat_id: n,
				is_attachments_sent: "YES",
				comments: ""
			}
		}, "*")
	}
	catch (e)
	{
		console.error(e), window.postMessage(
		{
			type: "send_attachments_error",
			payload:
			{
				chat_id: n,
				error: e,
				is_attachments_sent: "NO",
				comments: "Error while sending the attachments to number"
			}
		}, "*")
	}
})), window.addEventListener("PROSS::send-message", (async function (e)
{
	const t = e.detail.number,
		o = e.detail.message,
		n = t + "@c.us";
	try
	{
		await window.PROSS.sendMessage(n, o), window.postMessage(
		{
			type: "send_message",
			payload:
			{
				chat_id: n,
				is_message_sent: "YES",
				comments: ""
			}
		}, "*")
	}
	catch (e)
	{
		console.error(e), window.postMessage(
		{
			type: "send_message_error",
			payload:
			{
				chat_id: n,
				error: e,
				is_message_sent: "NO",
				comments: "Error while sending the message to number"
			}
		}, "*")
	}
})), window.addEventListener("PROSS::send-message-to-group", (async function (e)
{
	const t = e.detail.group_id,
		o = e.detail.message,
		n = {
			_serialized: e.detail.group_id
		};
	try
	{
		await window.PROSS.sendMessage(n, o), window.postMessage(
		{
			type: "send_message_to_group",
			payload:
			{
				group_id: t,
				is_message_sent: "YES",
				comments: ""
			}
		}, "*")
	}
	catch (e)
	{
		console.error(e), window.postMessage(
		{
			type: "send_message_to_group_error",
			payload:
			{
				chat_id: chatId,
				error: e,
				is_message_sent: "NO",
				comments: "Error while sending the message to group"
			}
		}, "*")
	}
})), window.addEventListener("PROSS::send-attachments-to-group", (async function (e)
{
	const t = e.detail.attachments,
		o = e.detail.caption,
		n = e.detail.groupId;
	try
	{
		const e = t.map((async (e, t) =>
		{
			const i = await JSON.parse(e.data),
				a = await window.PROSS.base64toFile(i, e.name);
			await window.PROSS.sendAttachment(a, n, o[t])
		}));
		await Promise.all(e), window.postMessage(
		{
			type: "send_attachments_to_group",
			payload:
			{
				group_id: n,
				is_attachments_sent: "YES",
				comments: ""
			}
		}, "*")
	}
	catch (e)
	{
		console.error(e), window.postMessage(
		{
			type: "send_attachments_to_group_error",
			payload:
			{
				group_id: n,
				error: e,
				is_attachments_sent: "NO",
				comments: "Error while sending the attachments to group"
			}
		}, "*")
	}
})), window.addEventListener("PROSS::export-group", (function (e)
{
	const t = e.detail.groupId;
	try
	{
		PROSS.getGroupMetadata(t).then((e =>
		{
			let t = Object.values(e.participants._index),
				o = e.__x_subject,
				n = [];
			t.forEach((e =>
			{
				let t = e.__x_contact.__x_name || e.__x_contact.__x_pushname || e.__x_contact.__x_shortName,
					o = "+" + e.__x_contact.__x_id.user;
				n.push([t, o])
			})), n.sort(), n.unshift(["Name", "Number"]);
			let i = "data:text/csv;charset=utf-8," + n.map((e => e.join(","))).join("\n"),
				a = encodeURI(i),
				s = document.createElement("a");
			s.setAttribute("href", a), s.setAttribute("download", o + ".csv"), document.body.appendChild(s), s.click()
		}))
	}
	catch (e)
	{
		window.postMessage(
		{
			type: "export_group_error",
			payload:
			{
				group_id: t,
				error: e
			}
		}, "*")
	}
})), window.addEventListener("PROSS::export-unsaved-contacts", (async function (e)
{
	let t = e.detail.type;
	try
	{
		let e = [],
			o = await PROSS.getMyUnsavedContacts(),
			n = "Advance" == t ? o.length : 10;
		for (let t = 0; t < n; t++)
		{
			let n = "+" + o[t].user,
				i = o[t].pushname || "Unknown";
			e.push([n, i])
		}
		if (e.unshift(["Numbers", "Name"]), "Expired" == t)
		{
			for (let t = 0; t < 3; t++) e.push([]);
			e.push(["To download all contacts please buy Advance Premium"])
		}
		let i = e.map((e => e.join(","))).join("\n"),
			a = new Blob([i],
			{
				type: "text/csv;charset=utf-8;"
			}),
			s = document.createElement("a");
		s.setAttribute("href", URL.createObjectURL(a)), s.setAttribute("download", "Advanced_All_Unsaved_Chats_Export.csv"), document.body.appendChild(s), s.click(), document.body.removeChild(s)
	}
	catch (e)
	{
		window.postMessage(
		{
			type: "export_unsaved_contacts_error",
			payload:
			{
				type: t,
				error: e
			}
		}, "*")
	}
}));
const getAllGroups = async function ()
{
	try
	{
		const e = (await PROSS.getAllGroups()).map((e => (
		{
			id: e.attributes.id,
			name: e.attributes.formattedTitle
		})));
		console.log('groups =',e);
		return window.postMessage(
		{
			type: "get_all_groups",
			payload: e
		}, "*"), e
	}
	catch (e)
	{
		return window.postMessage(
		{
			type: "get_all_groups_error",
			payload:
			{
				error: e
			}
		}, "*"), []
	}
};
window.addEventListener("PROSS::get-all-groups", getAllGroups);
const getAllContacts = async function ()
{
	try
	{
		const e = (await PROSS.getAllContacts()).map((e => (
		{
			id: e.attributes.id,
			name: e.attributes.name
		})));
		console.log('contacts',e);
		return window.postMessage(
		{
			type: "get_all_contacts",
			payload: e
		}, "*"), e
	}
	catch (e)
	{
		return window.postMessage(
		{
			type: "get_all_contacts_error",
			payload:
			{
				error: e
			}
		}, "*"), []
	}
};
window.addEventListener("PROSS::get-all-contacts", getAllContacts);
const getInitStoreType = function ()
	{
		let e = window?.Store?.InitType;
		return window.postMessage(
		{
			type: "get_init_store_type",
			payload: e
		}, "*"), e
	},
	getWhatsappVersion = function ()
	{
		let e = window?.Debug?.VERSION ? window.Debug.VERSION : "Not Found";
		return console.logSuccess(`InjectJS :: Whatsapp Version :: ${e}`), window.postMessage(
		{
			type: "get_whatsapp_version",
			payload: e
		}, "*"), e
	};
var checkInjectLoadedInterval;
const checkInjectLoaded = function ()
{
	clearInterval(checkInjectLoadedInterval), checkInjectLoadedInterval = setInterval((() =>
	{
		isWhatsappLoaded() && window.Store && window.PROSS && (clearInterval(checkInjectLoadedInterval), getAllGroups(), getAllContacts(), getInitStoreType(), getWhatsappVersion())
	}), 1e3)
};
clearInterval(checkInjectLoadedInterval), checkInjectLoadedInterval = setInterval((() =>
{
	isWhatsappLoaded() && window.Store && window.PROSS && (clearInterval(checkInjectLoadedInterval), getAllGroups(), getAllContacts(), getInitStoreType(), getWhatsappVersion())
}), 1e3);