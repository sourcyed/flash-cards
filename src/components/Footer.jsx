const Footer = () => {
  const footerStyle = {
    color: 'yellow',
    fontStyle: 'bold',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      Source Code
      <br />
      <a href="https://github.com/sourcyed/flash-cards">Front End</a>
      &nbsp;
      |
      &nbsp;
      <a href="https://github.com/sourcyed/flash-cards-backend">Back End</a>
    </div>
  )
}

export default Footer