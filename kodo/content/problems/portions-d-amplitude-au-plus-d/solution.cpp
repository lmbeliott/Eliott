#include <deque>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    long long d, x, b, c, m;
    cin >> n >> d >> x >> b >> c >> m;
    vector<long long> a(n);
    a[0] = x;
    for (int i = 1; i < n; i++) {
        a[i] = (a[i - 1] * b + c) % m;
    }

    deque<int> dmax;   // indices de la fenêtre, valeurs strictement décroissantes
    deque<int> dmin;   // indices de la fenêtre, valeurs strictement croissantes
    int g = 0;
    long long total = 0;
    for (int j = 0; j < n; j++) {
        while (!dmax.empty() && a[dmax.back()] <= a[j]) dmax.pop_back();
        dmax.push_back(j);
        while (!dmin.empty() && a[dmin.back()] >= a[j]) dmin.pop_back();
        dmin.push_back(j);
        // on raccourcit la fenêtre tant que son amplitude dépasse d
        while (a[dmax.front()] - a[dmin.front()] > d) {
            g++;
            if (dmax.front() < g) dmax.pop_front();
            if (dmin.front() < g) dmin.pop_front();
        }
        total += j - g + 1;
    }
    cout << total << "\n";
    return 0;
}
