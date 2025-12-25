# Docker Deployment Guide

## Quick Start

### TCP Connection (default, no USB needed)
```bash
docker-compose up -d
```

Then open http://localhost:5173 and connect to your Meshtastic device via TCP in the application UI.

### USB/Serial Connection
If you want to use USB/Serial connection directly in Docker:

1. Find your USB device path:
   ```bash
   ls -la /dev/ttyUSB*    # Linux
   ```

2. Uncomment and update `docker-compose.yml`:
   ```yaml
   devices:
     - /dev/ttyUSB0:/dev/ttyUSB0
   privileged: true
   ```

3. Start the container:
   ```bash
   docker-compose up -d
   ```

## Environment Variables

Create a `.env` file in the project root:

```bash
# Port mapping (optional, default: 5173)
# COMPOSE_PORT_PREFIX=8000

# Database path (optional)
DATABASE_PATH=/app/backend/data/meshradar.db
```

## Managing Containers

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f meshradar

# Rebuild image (if you made changes to code)
docker-compose up -d --build
```

## Data Persistence

All data (database, configuration) is stored in a Docker volume `meshradar_data`. This means your data persists even if you stop/remove the container.

To clean up volumes:
```bash
docker-compose down -v
```

## Troubleshooting

**Port already in use:**
Change the port in `docker-compose.yml`:
```yaml
ports:
  - "8000:80"  # Use 8000 instead of 5173
```

**USB device not found:**
- On Linux: Check permissions with `ls -la /dev/ttyUSB*`
- May need: `sudo usermod -a -G dialout $USER`
- On Windows WSL: Device paths like `COM3` might work

**Database errors:**
- Ensure volume has write permissions
- Check with: `docker-compose exec meshradar ls -la /app/backend/data`
