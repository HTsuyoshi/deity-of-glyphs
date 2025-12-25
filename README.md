# Deity of Glyphs

Play it on [Itch.io](https://technotopus.itch.io/deity-of-glyphs)

Web game made with [p5.js](https://p5js.org/) and has support for _phone_ and _computer_.

This is my first **complete** game, I hope you enjoy it as much as I did while developing this game.

If you find any bugs feel free to comment or open an issue in github. I will take a look as soon as I can.

### Game Flow Chart

```mermaid
flowchart LR
    Menu["Menu"] <--> Ach["Achievements"]
    Menu <--> Set["Settings"]
    Menu --> Sand["Sandbox"]
    Menu <--> Edit["Team Editor"]

    Edit --> Bat["Battle"]
    Edit <--> EditInfo["Team Editor Info"]
    Edit <--> Traits["Team Traits"]

    Bat <--> Info["Team Info"]
    Sand <--> Info

    Bat <--> BattleMenu["Battle Menu"]
    Sand <--> BattleMenu

    BattleMenu["Battle Menu"] --> Menu

    Bat <--> Win{"Win?"}
    Win -- Yes --> Ach
    Win -- No --> Edit
```

### Class Inheritance

```mermaid
classDiagram
        Particle <|-- BulletParticle
        Particle <|-- DeathParticle
        Particle <|-- TrailParticle
        TrailParticle <|-- ConfettiParticle
        class Particle {
          -Vector pos
          -Vector vel
          -int alpha
          -int size
          +constructor(pos, vel): void
          +update(): void
          +draw(): void
          =finished(): bool
        }
        class BulletParticle {
          +update(): void
          -draw_particle(): void
        }
        class TrailParticle {
          +setup(): void
          +update(): void
          -draw_particle(): void
        }
        class ConfettiParticle {
          +setup(): void
        }
        class DeathParticle {
          -Vector acc
          -Vector floor
          -float animation
          -bool turn
          +update(): void
          -draw_particle(): void
        }

        Solid <|-- SolidBullet
        SolidBullet <|-- Bullet
        SolidBullet <|-- Laser
        SolidBullet <|-- Explosion

        Solid <|-- Entity
        Entity <|-- Char
        Entity <|-- ViewChar
        Entity <|-- Doll

        Prop <|-- Button
        Prop <|-- Carrousel
        Prop <|-- Popup
        Prop <|-- Slider
        Prop <|-- UpgradeCard
```
