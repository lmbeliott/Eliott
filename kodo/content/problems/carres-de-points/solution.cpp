#include <iostream>
#include <vector>
#include <set>
#include <utility>
using namespace std;

set<pair<int, int>> ensemble;     // pour tester très vite si un point existe

bool est_present(int x, int y) {
    return ensemble.count({x, y}) > 0;
}

int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> points(n);
    for (int i = 0; i < n; i++) {
        cin >> points[i].first >> points[i].second;
        ensemble.insert(points[i]);
    }

    long long nombre = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i != j) {
                int ax = points[i].first, ay = points[i].second;
                int bx = points[j].first, by = points[j].second;
                // le côté AB, tourné d'un quart de tour : (dx, dy) devient (-dy, dx)
                int dx = bx - ax;
                int dy = by - ay;
                if (est_present(bx - dy, by + dx) && est_present(ax - dy, ay + dx)) {
                    nombre = nombre + 1;
                }
            }
        }
    }
    // chaque carré a été trouvé une fois par côté, parcouru dans le sens direct
    cout << nombre / 4 << "\n";
    return 0;
}
