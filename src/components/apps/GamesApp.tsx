import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SnakeGame } from "./games/SnakeGame";
import { TetrisGame } from "./games/TetrisGame";

export const GamesApp = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Games</h2>
      
      <Tabs defaultValue="snake" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="snake">Snake Xenzia</TabsTrigger>
          <TabsTrigger value="tetris">Tetris</TabsTrigger>
        </TabsList>

        <TabsContent value="snake">
          <SnakeGame />
        </TabsContent>

        <TabsContent value="tetris">
          <TetrisGame />
        </TabsContent>
      </Tabs>
    </div>
  );
};
