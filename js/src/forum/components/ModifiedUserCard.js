import Component from 'flarum/Component';
import humanTime from 'flarum/utils/humanTime';
import ItemList from 'flarum/utils/ItemList';
import UserControls from 'flarum/utils/UserControls';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';
import icon from 'flarum/helpers/icon';
import Dropdown from 'flarum/components/Dropdown';
import AvatarEditor from 'flarum/components/AvatarEditor';
import listItems from 'flarum/helpers/listItems';

/**
 * The `UserCard` component displays a user's profile card. This is used both on
 * the `UserPage` (in the hero) and in discussions, shown when hovering over a
 * post author.
 *
 * ### Props
 *
 * - `user`
 * - `className`
 * - `editable`
 * - `controlsButtonClassName`
 */
export default class ModifiedUserCard extends Component {
  view() {
    const user = this.props.user;

    const controls = UserControls.controls(user, this).toArray();
    const color = user.color();
    const badges = user.badges().toArray();

    return (
      <div className={'UserCard ' + (this.props.className || '')} style={color ? { backgroundColor: color } : ''}>
        <div className="darkenBackground">
          <div className="container">
            {controls.length
              ? Dropdown.component({
                  children: controls,
                  className: 'UserCard-controls App-primaryControl',
                  menuClassName: 'Dropdown-menu--right',
                  buttonClassName: this.props.controlsButtonClassName,
                  label: app.translator.trans('core.forum.user_controls.button'),
                  icon: 'fas fa-ellipsis-v',
                })
              : ''}

            <div className="UserCard-profile">
              <h2 className="UserCard-identity">
                {this.props.editable ? (
                  [
                    AvatarEditor.component({
                      user,
                      className: 'UserCard-avatar',
                    }),
                    username(user),
                  ]
                ) : (
                  <a href={app.route.user(user)} config={this.stopProp}>
                    <div className="UserCard-avatar">{avatar(user)}</div>
                    {username(user)}
                  </a>
                )}
              </h2>

              {badges.length ? <ul className="UserCard-badges badges">{listItems(badges)}</ul> : ''}

              <ul className="UserCard-info">{listItems(this.infoItems().toArray())}</ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Build an item list of tidbits of info to show on this user's profile.
   *
   * @return {ItemList}
   */
  infoItems() {
    const items = new ItemList();
    const user = this.props.user;
    const lastSeenAt = user.lastSeenAt();

    if (lastSeenAt) {
      const online = user.isOnline();

      items.add(
        'lastSeen',
        <span className={'UserCard-lastSeen' + (online ? ' online' : '')}>
          {online
            ? [icon('fas fa-circle'), ' ', app.translator.trans('core.forum.user.online_text')]
            : [icon('far fa-clock'), ' ', humanTime(lastSeenAt)]}
        </span>
      );
    }

    if (user.joinTime()) {
      items.add(
        'joined',
        app.translator.trans('core.forum.user.joined_date_text', {
          ago: humanTime(user.joinTime()),
        })
      );
    }

    return items;
  }

  stopProp(element, isInitialized) {
    if (isInitialized) return;
    $(element).on('click', (e) => e.stopPropagation());
    m.route.apply(this, arguments);
  }
}
