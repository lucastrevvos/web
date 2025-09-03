type Props = { params: { slug: string } };

export default async function TagPage({ params }: Props) {
  return <main className="p-6">Tag: {params.slug}</main>;
}
