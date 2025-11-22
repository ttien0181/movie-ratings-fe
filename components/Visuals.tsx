import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Genre, ReviewResponse } from '../types';

// --- D3 Genre Bubble Chart ---
interface GenreBubblesProps {
  genres: Genre[];
  onSelectGenre: (id: number | null) => void;
  selectedGenreId: number | null;
}

export const GenreBubbles: React.FC<GenreBubblesProps> = ({ genres, onSelectGenre, selectedGenreId }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || genres.length === 0) return;

    const width = svgRef.current.parentElement?.clientWidth || 400;
    const height = 200;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Data format for pack
    const data = {
      children: genres.map(g => ({ ...g, value: 10 + Math.random() * 20 })) // Random size for visual variety
    };

    const root = d3.hierarchy(data)
      .sum((d: any) => d.value);

    const pack = d3.pack()
      .size([width, height])
      .padding(5);

    const nodes = pack(root).leaves();

    const g = svg.append("g");

    const node = g.selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .on("click", (event, d: any) => {
        const genreId = d.data.id;
        onSelectGenre(selectedGenreId === genreId ? null : genreId);
      });

    node.append("circle")
      .attr("r", d => d.r)
      .attr("fill", (d: any) => selectedGenreId === d.data.id ? "#e11d48" : "#334155")
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 2)
      .transition().duration(500)
      .attr("fill", (d: any) => selectedGenreId === d.data.id ? "#e11d48" : "#334155");

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .text((d: any) => d.data.name)
      .attr("fill", "white")
      .style("font-size", (d) => Math.min(d.r / 2, 12))
      .style("font-weight", "500")
      .style("pointer-events", "none");

  }, [genres, selectedGenreId, onSelectGenre]);

  return (
    <div className="w-full h-[200px] bg-brand-800 rounded-xl overflow-hidden border border-brand-700 relative">
        <p className="absolute top-2 left-2 text-xs text-gray-400 z-10">Filter by Genre (D3.js)</p>
       <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

// --- Recharts Rating Distribution ---

interface RatingChartProps {
  reviews: ReviewResponse[];
}

export const RatingChart: React.FC<RatingChartProps> = ({ reviews }) => {
  const data = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
        const rating = Math.round(r.rating);
        if (rating >= 1 && rating <= 5) {
            counts[rating as keyof typeof counts]++;
        }
    });
    return [
        { name: '1 Star', count: counts[1] },
        { name: '2 Stars', count: counts[2] },
        { name: '3 Stars', count: counts[3] },
        { name: '4 Stars', count: counts[4] },
        { name: '5 Stars', count: counts[5] },
    ];
  }, [reviews]);

  if (reviews.length === 0) return <div className="text-gray-400 text-sm">No reviews to analyze.</div>;

  return (
    <div className="h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                    cursor={{fill: '#334155', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index > 2 ? '#4ade80' : index > 1 ? '#facc15' : '#f87171'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};
