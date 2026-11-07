#include <iostream>
using namespace std;

int main() {
    // 1. Les deux petits disques passent de A à B (détour par C).
    cout << "A C" << "\n";
    cout << "A B" << "\n";
    cout << "C B" << "\n";
    // 2. Le grand disque passe de A à C.
    cout << "A C" << "\n";
    // 3. Les deux petits disques passent de B à C (détour par A).
    cout << "B A" << "\n";
    cout << "B C" << "\n";
    cout << "A C" << "\n";
    return 0;
}
