import styled from "styled-components"

export const Button = styled.button.attrs(props => {
    return {
        className: `btn ${props.type === "primary" ? "btn-primary" : "btn-outline-secondary"} ${props.isLoading ? '' : ''}`,
        disabled : props.isLoading
    }
})
    `
      float: ${props => props.position === "left" ? "left" : (props.position === "right" ? "right" : "")}
    `;

export const BackDrop = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  cursor: none;
  z-index: 2;
  background: rgba(111, 111, 111, 0.3)
`

export const Clear = styled.div`
  clear: both
`
