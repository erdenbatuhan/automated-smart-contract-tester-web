define include_env_if_exists
  ifneq (,$(wildcard $(1)))
    include $(1)
    ENV_FILES += --env-file $(1)
  endif
endef

include .env

ENV_FILES = --env-file .env --env-file .env.$(ENV)
COMPOSE_FILE = -f docker/$(ENV)/docker-compose.$(ENV).yml

# Include local environment files if they exist
$(eval $(call include_env_if_exists,.env.local))
$(eval $(call include_env_if_exists,.env.$(ENV).local))

.PHONY: stop
stop:
	docker compose -p $(APP_NAME) down || true

.PHONY: start
start: stop
	docker compose --project-directory . -p $(APP_NAME) $(ENV_FILES) $(COMPOSE_FILE) up --build $(ARGS)

.PHONY: clean_dangling_volumes
clean_dangling_volumes: stop
	docker volume ls -qf "dangling=true" | egrep '^[a-z0-9]{64}' | xargs docker volume rm -f || true

.PHONY: clean
clean: clean_dangling_volumes
	docker compose -p $(APP_NAME) ps -aq | xargs docker rm -f || true
	docker network ls -qf "label=com.docker.compose.project=$(APP_NAME)" | xargs docker network rm -f || true
	docker images -qf "label=com.docker.compose.project=$(APP_NAME)" | xargs docker rmi -f

### ----------------------------------------------------------------------- ###
###  Caution: Use the following commands carefully!                         ###
###  This warning emphasizes the need for caution when using the commands.  ###
### ----------------------------------------------------------------------- ###

.PHONY: prune
prune: stop
	docker system prune

.PHONY: prune_with_volumes
prune_with_volumes: stop
	docker system prune -a --volumes
