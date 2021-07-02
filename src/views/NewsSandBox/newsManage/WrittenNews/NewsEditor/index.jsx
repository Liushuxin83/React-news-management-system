import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// 富文本编辑器
export default function NewsEditor(props) {
	const [editorState, setEditorState] = useState('')
	useEffect(() => {
		// console.log(props.content);
		const html = props.content
		if (html === undefined) return
		const contentBlock = htmlToDraft(html)
		if (contentBlock) {
			const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
			const editorState = EditorState.createWithContent(contentState)
			setEditorState(editorState)
		}
	}, [props.content])
	return (
		<Editor
			editorState={editorState}
			toolbarClassName="toolbarClassName"
			wrapperClassName="wrapperClassName"
			editorClassName="editorClassName"
			onEditorStateChange={(itsEditorState) => setEditorState(itsEditorState)}
			onBlur={() => {
				props.getNewsContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
				// console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
			}}
		/>
	)
}
