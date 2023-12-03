
export const Card = ({data}) => (
    <div className="col" role="complementary" aria-label={data.name} aria-description={data.text}>
      <p>{data.name} {data.cost}</p>
      <p>{data.text}</p>
    </div>
)
