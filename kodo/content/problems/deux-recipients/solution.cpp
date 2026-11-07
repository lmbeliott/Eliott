#include <algorithm>
#include <iostream>
#include <map>
#include <queue>
#include <utility>
using namespace std;

int main() {
    long long a, b, c;
    cin >> a >> b >> c;
    map<pair<long long, long long>, int> dist;      // seuls les états atteints sont stockés
    queue<pair<long long, long long>> file;
    dist[{0, 0}] = 0;
    file.push({0, 0});
    int reponse = -1;
    while (!file.empty()) {
        auto [x, y] = file.front();
        file.pop();
        int d = dist[{x, y}];
        if (x == c || y == c) {
            reponse = d;
            break;
        }
        long long v = min(x, b - y);                // versement du premier dans le second
        long long w = min(y, a - x);                // versement du second dans le premier
        pair<long long, long long> suivants[6] = {{a, y}, {x, b}, {0, y}, {x, 0}, {x - v, y + v}, {x + w, y - w}};
        for (auto etat : suivants) {
            if (!dist.count(etat)) {
                dist[etat] = d + 1;
                file.push(etat);
            }
        }
    }
    cout << reponse << "\n";
    return 0;
}
