"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      flexDirection: props.direction === 'vertical' ? 'column' : 'row'
    }}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e5e5e5',
      height: '4px',
      width: '100%',
      cursor: 'row-resize',
      flexShrink: 0
    }}
    {...props}
  >
    {withHandle && (
      <div style={{
        zIndex: 10,
        display: 'flex',
        height: '16px',
        width: '12px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        border: '1px solid #e5e5e5',
        backgroundColor: '#f5f5f5'
      }}>
        <GripVertical style={{ height: '10px', width: '10px' }} />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }