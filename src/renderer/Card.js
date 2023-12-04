
export const Card = ({data, tabIndex}) => (
    <div className="col" 
    aria-label={data.name} 
    aria-description={data.text}
    tabIndex={tabIndex}>
      <p>{data.name} {data.cost}</p>
      <p>{data.text}</p>
    </div>
)
