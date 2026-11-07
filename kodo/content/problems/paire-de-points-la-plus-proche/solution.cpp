#include <algorithm>
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

typedef pair<long long, long long> Point;
vector<Point> p, tmp;     // p : d'abord trié par abscisse, puis par ordonnée par morceaux

long long carre(long long v) { return v * v; }

// p[debut..fin[ est trié par abscisse ; renvoie le plus petit carré de distance
// et laisse p[debut..fin[ trié par ordonnée
long long plusProche(int debut, int fin) {
    int n = fin - debut;
    if (n <= 3) {
        long long meilleur = 4000000000000000000LL;
        for (int i = debut; i < fin; i++) {
            for (int j = i + 1; j < fin; j++) {
                meilleur = min(meilleur, carre(p[i].first - p[j].first) + carre(p[i].second - p[j].second));
            }
        }
        sort(p.begin() + debut, p.begin() + fin, [](const Point& a, const Point& b) { return a.second < b.second; });
        return meilleur;
    }
    int milieu = debut + n / 2;
    long long xm = p[milieu].first;
    long long meilleur = min(plusProche(debut, milieu), plusProche(milieu, fin));
    // fusion des deux moitiés par ordonnée
    int i = debut, j = milieu, k = debut;
    while (i < milieu && j < fin) {
        if (p[i].second <= p[j].second) {
            tmp[k++] = p[i++];
        } else {
            tmp[k++] = p[j++];
        }
    }
    while (i < milieu) tmp[k++] = p[i++];
    while (j < fin) tmp[k++] = p[j++];
    for (int q = debut; q < fin; q++) {
        p[q] = tmp[q];
    }
    // la bande autour de la droite x = xm, triée par ordonnée
    vector<Point> bande;
    for (int q = debut; q < fin; q++) {
        if (carre(p[q].first - xm) < meilleur) {
            bande.push_back(p[q]);
        }
    }
    for (int a = 0; a < (int) bande.size(); a++) {
        for (int b = a + 1; b < (int) bande.size(); b++) {
            long long dy = bande[b].second - bande[a].second;
            if (dy * dy >= meilleur) {
                break;
            }
            meilleur = min(meilleur, carre(bande[b].first - bande[a].first) + dy * dy);
        }
    }
    return meilleur;
}

int main() {
    long long n, x, b, c, m;
    cin >> n >> x >> b >> c >> m;
    vector<long long> u(2 * n);
    u[0] = x;
    for (int k = 1; k < 2 * n; k++) {
        u[k] = (u[k - 1] * b + c) % m;
    }
    p.resize(n);
    tmp.resize(n);
    for (int i = 0; i < n; i++) {
        p[i] = {u[2 * i], u[2 * i + 1]};
    }
    sort(p.begin(), p.end());
    cout << plusProche(0, n) << "\n";
    return 0;
}
