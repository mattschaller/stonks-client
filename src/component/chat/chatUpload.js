import React, { useEffect, useContext, useState, useCallback } from 'react';
import { serviceContext } from "../../contexts/ServiceContext";
import { authContext } from "../../contexts/AuthContext";
import { Space } from 'antd';
import {useDropzone} from 'react-dropzone'

import { UploadOutlined, LoadingOutlined, WarningOutlined , SmileOutlined, PlusCircleOutlined } from '@ant-design/icons';

const ChatUpload = props => {
    const { auth } = useContext(authContext);
    const { service  } = useContext(serviceContext);
    const [files, setFiles] = useState([]);
    // TODO: add to .env  
    const maxSize = 1048576; 

    useEffect(() => {
        console.log('files changes: ', files)
    }, [files]);

    const onDrop = useCallback((acceptedFiles) => {

        acceptedFiles.forEach((file) => {
          const reader = new FileReader()
     
          reader.onabort = () => console.log('file reading was aborted')
          reader.onerror = () => console.log('file reading has failed')
          reader.onload = () => {
          // Do whatever you want with the file contents
            const binaryStr = reader.result
            // service.send("create", "blobs", { uri: binaryStr })
            // TODO: Check file list for dupes before uploading⚠️  
          }
          reader.readAsDataURL(file)
        })

        console.log('acceptedFiles: ', acceptedFiles)
        
      }, [files])

    const {getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles, rejectedFiles } = useDropzone({onDrop,
        accept: 'image/png',
        minSize: 0,
        maxSize, 
    })

    return (
        <div className='chat-upload' {...getRootProps()}>
            <input className="chat-upload__file-drop" {...getInputProps()} />
            {acceptedFiles.length && acceptedFiles.forEach(file => (
                    <Space>
                        results: {file}
                    </Space>
            ))}

            {files.length && (
                <div className="chat-upload__file-pending">
                    <Space>
                        {files.length && files.map(data => (
                            <span key={data.file.name}>
                                {data.file.name}
                            </span>
                        ))}
                    </Space>
                </div>
            )}
            {/* {!isDragActive && (<UploadOutlined />)}
            {isDragActive && !isDragReject && (<LoadingOutlined spin='true' />)}
            {isDragReject && (<WarningOutlined />)} */}

        </div>
    )
}

export default ChatUpload;